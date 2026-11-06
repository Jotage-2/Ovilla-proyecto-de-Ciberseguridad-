// Detalle del curso: información, lecciones y contenido (si está desbloqueado)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatoPrecio } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseImage from '../components/CourseImage.jsx';
import Loader from '../components/Loader.jsx';

// Convierte un enlace de YouTube o Vimeo en uno que se pueda incrustar
function urlEmbed(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function CourseDetail() {
  const { id } = useParams();
  const { usuario, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState('');
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    setCurso(null);
    setError('');
    api.curso(id).then(setCurso).catch((e) => setError(e.message));
  }, [id, usuario]);

  if (error) {
    return (
      <div className="container page">
        <div className="alert alert--error">{error}</div>
        <Link to="/" className="btn btn--ghost">Volver al catálogo</Link>
      </div>
    );
  }
  if (!curso) return <Loader />;

  const leccion = curso.lecciones[activa];
  const video = curso.acceso && urlEmbed(leccion?.video_url);

  const comprar = () => {
    if (!usuario) return navigate('/entrar', { state: { desde: `/comprar/${curso.id}` } });
    navigate(`/comprar/${curso.id}`);
  };

  return (
    <div className="container page">
      <Link to="/" className="back">← Volver al catálogo</Link>

      <section className="detail">
        <div className="detail__info">
          {curso.categoria && <span className="card__cat">{curso.categoria}</span>}
          <h1>{curso.titulo}</h1>
          <p className="detail__desc">{curso.descripcion}</p>
          <ul className="detail__facts">
            <li><span>Autora/or</span><strong>{curso.autor}</strong></li>
            <li><span>Nivel</span><strong>{curso.nivel}</strong></li>
            <li><span>Lecciones</span><strong>{curso.total_lecciones}</strong></li>
            {curso.duracion && <li><span>Duración</span><strong>{curso.duracion}</strong></li>}
          </ul>
        </div>

        <aside className="buybox">
          <CourseImage src={curso.imagen} alt={curso.titulo} className="buybox__img" />
          <div className="buybox__body">
            {curso.acceso ? (
              <>
                <p className="buybox__status">
                  {curso.es_gratis ? '🎁 Curso gratuito' : esAdmin ? '👑 Vista del dueño' : '✅ Ya tienes este curso'}
                </p>
                <a href="#contenido" className="btn btn--primary btn--block">Ir a las lecciones</a>
              </>
            ) : (
              <>
                <p className="price price--lg">{formatoPrecio(curso.precio)}</p>
                <button className="btn btn--primary btn--block" onClick={comprar}>Comprar curso</button>
                <p className="buybox__note">Pago único · Acceso de por vida</p>
              </>
            )}
          </div>
        </aside>
      </section>

      <section className="lessons" id="contenido">
        <h2>Contenido del curso</h2>
        <div className="lessons__layout">
          <ol className="lessons__list">
            {curso.lecciones.map((l, i) => (
              <li key={l.id}>
                <button
                  className={`lesson-item ${i === activa ? 'is-active' : ''} ${l.bloqueada ? 'is-locked' : ''}`}
                  onClick={() => setActiva(i)}
                >
                  <span className="lesson-item__num">{i + 1}</span>
                  <span className="lesson-item__title">{l.titulo}</span>
                  <span className="lesson-item__icon">{l.bloqueada ? '🔒' : '▶'}</span>
                </button>
              </li>
            ))}
            {curso.lecciones.length === 0 && <li className="muted">Este curso aún no tiene lecciones.</li>}
          </ol>

          <div className="lesson-view">
            {!leccion ? null : curso.acceso ? (
              <>
                <span className="eyebrow">Lección {activa + 1}</span>
                <h3>{leccion.titulo}</h3>
                {video && (
                  <div className="video">
                    <iframe src={video} title={leccion.titulo} allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                  </div>
                )}
                {leccion.video_url && !video && (
                  <p><a href={leccion.video_url} target="_blank" rel="noreferrer">Abrir video de la lección ↗</a></p>
                )}
                <p className="lesson-view__text">{leccion.contenido || 'Sin descripción.'}</p>
                <div className="lesson-view__nav">
                  <button className="btn btn--ghost btn--sm" disabled={activa === 0} onClick={() => setActiva(activa - 1)}>
                    ← Anterior
                  </button>
                  <button className="btn btn--soft btn--sm" disabled={activa === curso.lecciones.length - 1}
                    onClick={() => setActiva(activa + 1)}>
                    Siguiente →
                  </button>
                </div>
              </>
            ) : (
              <div className="locked">
                <span className="locked__icon">🔒</span>
                <h3>Contenido bloqueado</h3>
                <p>Compra el curso para desbloquear las {curso.total_lecciones} lecciones.</p>
                <button className="btn btn--primary" onClick={comprar}>
                  Desbloquear por {formatoPrecio(curso.precio)}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
