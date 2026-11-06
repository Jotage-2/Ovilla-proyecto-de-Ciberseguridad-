// Formulario para crear o editar un curso y sus lecciones
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import CourseImage from '../../components/CourseImage.jsx';
import Loader from '../../components/Loader.jsx';

const VACIO = {
  titulo: '',
  descripcion: '',
  autor: '',
  precio: '',
  es_gratis: false,
  imagen: '',
  nivel: 'Principiante',
  duracion: '',
  categoria_id: '',
  lecciones: [{ titulo: '', contenido: '', video_url: '' }],
};

export default function AdminCourseForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIO);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.categorias().then(setCategorias).catch(() => {});
    if (editando) {
      api
        .adminCurso(id)
        .then((c) => setForm({
          ...c,
          precio: c.es_gratis ? '' : String(c.precio),
          categoria_id: c.categoria_id ? String(c.categoria_id) : '',
          lecciones: c.lecciones.length ? c.lecciones : VACIO.lecciones,
        }))
        .catch((e) => setError(e.message))
        .finally(() => setCargando(false));
    } else {
      setForm(VACIO);
    }
  }, [id, editando]);

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const setLeccion = (i, campo, valor) =>
    setForm((f) => ({ ...f, lecciones: f.lecciones.map((l, j) => (j === i ? { ...l, [campo]: valor } : l)) }));

  const agregarLeccion = () =>
    setForm((f) => ({ ...f, lecciones: [...f.lecciones, { titulo: '', contenido: '', video_url: '' }] }));

  const quitarLeccion = (i) =>
    setForm((f) => ({ ...f, lecciones: f.lecciones.filter((_, j) => j !== i) }));

  const moverLeccion = (i, dir) =>
    setForm((f) => {
      const l = [...f.lecciones];
      const j = i + dir;
      if (j < 0 || j >= l.length) return f;
      [l[i], l[j]] = [l[j], l[i]];
      return { ...f, lecciones: l };
    });

  const subirImagen = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true);
    setError('');
    try {
      const r = await api.subirImagen(archivo);
      set('imagen', r.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
      e.target.value = '';
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    const datos = {
      ...form,
      precio: form.es_gratis ? 0 : Number(String(form.precio).replace(',', '.')),
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
    };
    try {
      if (editando) await api.editarCurso(id, datos);
      else await api.crearCurso(datos);
      navigate('/admin/cursos');
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Loader />;

  return (
    <form onSubmit={guardar}>
      <div className="page__head page__head--row">
        <h1>{editando ? 'Editar curso' : 'Nuevo curso'}</h1>
        <Link to="/admin/cursos" className="btn btn--ghost">Cancelar</Link>
      </div>
      {error && <div className="alert alert--error">{error}</div>}

      <div className="form-grid">
        <div className="panel">
          <h3>Información</h3>
          <label className="field">
            <span>Título del curso *</span>
            <input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} required />
          </label>
          <label className="field">
            <span>Descripción</span>
            <textarea rows={4} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Autor/a *</span>
              <input value={form.autor} onChange={(e) => set('autor', e.target.value)} required />
            </label>
            <label className="field">
              <span>Categoría *</span>
              <select value={form.categoria_id} onChange={(e) => set('categoria_id', e.target.value)} required>
                <option value="">Elige una…</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>Nivel</span>
              <select value={form.nivel} onChange={(e) => set('nivel', e.target.value)}>
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
            </label>
            <label className="field">
              <span>Duración (ej. 2 h 30 min)</span>
              <input value={form.duracion} onChange={(e) => set('duracion', e.target.value)} />
            </label>
          </div>
        </div>

        <div className="panel">
          <h3>Precio e imagen</h3>
          <label className="toggle">
            <input type="checkbox" checked={form.es_gratis} onChange={(e) => set('es_gratis', e.target.checked)} />
            <span>Curso gratuito (todos pueden verlo)</span>
          </label>
          {!form.es_gratis && (
            <label className="field">
              <span>Precio en soles (S/) *</span>
              <input inputMode="decimal" placeholder="59.90" value={form.precio}
                onChange={(e) => set('precio', e.target.value)} required />
            </label>
          )}

          <div className="field">
            <span>Imagen de portada</span>
            <div className="cover-preview">
              <CourseImage src={form.imagen} alt="Vista previa" />
            </div>
            <label className="btn btn--soft btn--sm upload-btn">
              {subiendo ? 'Subiendo…' : '📷 Subir imagen desde mi computadora'}
              <input type="file" accept="image/*" onChange={subirImagen} hidden />
            </label>
            <input className="input" placeholder="…o pega el enlace de una imagen" value={form.imagen}
              onChange={(e) => set('imagen', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="page__head--row">
          <h3>Lecciones ({form.lecciones.length})</h3>
          <button type="button" className="btn btn--soft btn--sm" onClick={agregarLeccion}>+ Agregar lección</button>
        </div>
        <p className="muted small">El contenido de las lecciones de un curso de pago solo lo verán quienes lo compren.</p>

        {form.lecciones.map((l, i) => (
          <div className="lesson-edit" key={i}>
            <div className="lesson-edit__head">
              <strong>Lección {i + 1}</strong>
              <div className="actions">
                <button type="button" className="btn btn--ghost btn--xs" onClick={() => moverLeccion(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="btn btn--ghost btn--xs" onClick={() => moverLeccion(i, 1)} disabled={i === form.lecciones.length - 1}>↓</button>
                <button type="button" className="btn btn--danger btn--xs" onClick={() => quitarLeccion(i)}>Quitar</button>
              </div>
            </div>
            <label className="field">
              <span>Título</span>
              <input value={l.titulo} onChange={(e) => setLeccion(i, 'titulo', e.target.value)} />
            </label>
            <label className="field">
              <span>Enlace del video (YouTube o Vimeo, opcional)</span>
              <input placeholder="https://www.youtube.com/watch?v=..." value={l.video_url}
                onChange={(e) => setLeccion(i, 'video_url', e.target.value)} />
            </label>
            <label className="field">
              <span>Explicación / instrucciones</span>
              <textarea rows={3} value={l.contenido} onChange={(e) => setLeccion(i, 'contenido', e.target.value)} />
            </label>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <Link to="/admin/cursos" className="btn btn--ghost">Cancelar</Link>
        <button className="btn btn--primary btn--lg" disabled={guardando || subiendo}>
          {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Publicar curso'}
        </button>
      </div>
    </form>
  );
}
