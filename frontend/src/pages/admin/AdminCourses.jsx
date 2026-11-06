// Lista de cursos con opciones de editar y eliminar
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatoPrecio } from '../../api.js';
import CourseImage from '../../components/CourseImage.jsx';
import Loader from '../../components/Loader.jsx';

export default function AdminCourses() {
  const [cursos, setCursos] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = () => api.adminCursos().then(setCursos).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  const eliminar = async (c) => {
    const aviso = c.ventas > 0
      ? `"${c.titulo}" tiene ${c.ventas} venta(s). Si lo eliminas, esos clientes perderán el acceso. ¿Eliminar de todas formas?`
      : `¿Eliminar el curso "${c.titulo}"? Esta acción no se puede deshacer.`;
    if (!window.confirm(aviso)) return;
    try {
      await api.eliminarCurso(c.id);
      setMensaje('Curso eliminado.');
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!cursos) return error ? <div className="alert alert--error">{error}</div> : <Loader />;

  const visibles = cursos.filter((c) => c.titulo.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <>
      <div className="page__head page__head--row">
        <h1>Cursos</h1>
        <Link to="/admin/cursos/nuevo" className="btn btn--primary">+ Nuevo curso</Link>
      </div>

      {mensaje && <div className="alert alert--ok">{mensaje}</div>}
      {error && <div className="alert alert--error">{error}</div>}

      <div className="panel">
        <input className="input" placeholder="Filtrar por nombre…" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Curso</th><th>Categoría</th><th>Tipo</th><th className="num">Precio</th><th className="num">Ventas</th><th /></tr>
            </thead>
            <tbody>
              {visibles.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="table__course">
                      <CourseImage src={c.imagen} alt="" className="table__thumb" />
                      <div>
                        <Link to={`/curso/${c.id}`}><strong>{c.titulo}</strong></Link>
                        <div className="muted small">{c.autor} · {c.total_lecciones} lecciones</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.categoria || '—'}</td>
                  <td>{c.es_gratis ? <span className="pill pill--free">Gratis</span> : <span className="pill">Pago</span>}</td>
                  <td className="num">{c.es_gratis ? '—' : formatoPrecio(c.precio)}</td>
                  <td className="num">{c.ventas}</td>
                  <td className="actions">
                    <Link to={`/admin/cursos/${c.id}/editar`} className="btn btn--soft btn--sm">Editar</Link>
                    <button className="btn btn--danger btn--sm" onClick={() => eliminar(c)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr><td colSpan={6} className="muted">No hay cursos con ese nombre.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
