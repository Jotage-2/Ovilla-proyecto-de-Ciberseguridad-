// Tarjeta de curso para el catálogo
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatoPrecio } from '../api.js';
import CourseImage from './CourseImage.jsx';

export default function CourseCard({ curso }) {
  const { usuario, esAdmin } = useAuth();
  const navigate = useNavigate();
  const desbloqueado = curso.es_gratis || curso.comprado || esAdmin;

  const accion = () => {
    if (desbloqueado) return navigate(`/curso/${curso.id}`);
    if (!usuario) return navigate('/entrar', { state: { desde: `/comprar/${curso.id}` } });
    navigate(`/comprar/${curso.id}`);
  };

  let textoBoton = 'Comprar';
  if (curso.es_gratis) textoBoton = 'Empezar gratis';
  else if (curso.comprado) textoBoton = 'Continuar';
  else if (esAdmin) textoBoton = 'Ver curso';

  return (
    <article className="card">
      <Link to={`/curso/${curso.id}`} className="card__media">
        <CourseImage src={curso.imagen} alt={curso.titulo} />
        {curso.es_gratis && <span className="badge badge--free">Gratis</span>}
        {curso.comprado && <span className="badge badge--owned">Comprado</span>}
      </Link>
      <div className="card__body">
        {curso.categoria && <span className="card__cat">{curso.categoria}</span>}
        <h3 className="card__title">
          <Link to={`/curso/${curso.id}`}>{curso.titulo}</Link>
        </h3>
        <p className="card__author">por {curso.autor}</p>
        <div className="card__meta">
          <span>{curso.nivel}</span>
          <span>·</span>
          <span>{curso.total_lecciones} lecciones</span>
        </div>
        <div className="card__footer">
          <span className={`price ${curso.es_gratis ? 'price--free' : ''}`}>
            {curso.es_gratis ? 'Gratis' : formatoPrecio(curso.precio)}
          </span>
          <button
            className={`btn btn--sm ${desbloqueado ? 'btn--soft' : 'btn--primary'}`}
            onClick={accion}
          >
            {textoBoton}
          </button>
        </div>
      </div>
    </article>
  );
}
