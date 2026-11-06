// "Mis cursos": los cursos que el cliente compró
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatoFecha } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseImage from '../components/CourseImage.jsx';
import Loader from '../components/Loader.jsx';

export default function MyCourses() {
  const { usuario, esAdmin } = useAuth();
  const [cursos, setCursos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.misCursos().then(setCursos).catch((e) => setError(e.message));
  }, []);

  if (esAdmin) {
    return (
      <div className="container page">
        <div className="alert">Como dueño tienes acceso a todos los cursos. <Link to="/admin/cursos">Ir a mis cursos publicados</Link></div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Mis cursos</h1>
        <p className="muted">Hola {usuario.nombre.split(' ')[0]}, aquí están los cursos que compraste.</p>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {!cursos ? (
        <Loader />
      ) : cursos.length === 0 ? (
        <div className="empty">
          <span className="empty__icon">🛍️</span>
          <h3>Aún no compraste cursos</h3>
          <p>Explora el catálogo o empieza con un curso gratuito.</p>
          <Link to="/" className="btn btn--primary">Ver catálogo</Link>
        </div>
      ) : (
        <div className="mylist">
          {cursos.map((c) => (
            <Link to={`/curso/${c.id}`} key={c.id} className="mylist__item">
              <CourseImage src={c.imagen} alt={c.titulo} className="mylist__img" />
              <div className="mylist__body">
                <span className="card__cat">{c.categoria}</span>
                <h3>{c.titulo}</h3>
                <p className="muted">por {c.autor} · {c.total_lecciones} lecciones</p>
                <p className="mylist__date">Comprado el {formatoFecha(c.fecha_compra)}</p>
              </div>
              <span className="btn btn--soft btn--sm">Continuar →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
