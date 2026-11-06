// Página principal: portada, categorías al costado y catálogo en tarjetas
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseCard from '../components/CourseCard.jsx';
import CategorySidebar from '../components/CategorySidebar.jsx';
import Loader from '../components/Loader.jsx';

export default function Home() {
  const { usuario } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const categoria = params.get('categoria') || '';
  const tipo = params.get('tipo') || '';

  const [categorias, setCategorias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.categorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    setError('');
    api
      .cursos({ q, categoria, tipo })
      .then(setCursos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [q, categoria, tipo, usuario]);

  const cambiar = (clave, valor) => {
    const nuevos = new URLSearchParams(params);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    setParams(nuevos);
  };

  const nombreCategoria = categorias.find((c) => c.slug === categoria)?.nombre;
  const hayFiltros = q || categoria || tipo;

  return (
    <>
      {!hayFiltros && (
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__text">
              <span className="eyebrow">Escuela online de crochet</span>
              <h1>Teje lo que imaginas, <em>punto por punto.</em></h1>
              <p>
                Cursos en video y paso a paso con tejedoras peruanas. Empieza gratis
                con lo básico y avanza hasta tus propios amigurumis y prendas.
              </p>
              <div className="hero__actions">
                <a href="#catalogo" className="btn btn--primary">Ver cursos</a>
                {!usuario && <Link to="/registro" className="btn btn--ghost">Crear cuenta gratis</Link>}
              </div>
              <ul className="hero__stats">
                <li><strong>{categorias.reduce((s, c) => s + c.total, 0) || '—'}</strong> cursos</li>
                <li><strong>{categorias.length || '—'}</strong> categorías</li>
                <li><strong>De por vida</strong> acceso al comprar</li>
              </ul>
            </div>
            <div className="hero__art" aria-hidden="true">
              <div className="yarn yarn--1" />
              <div className="yarn yarn--2" />
              <div className="yarn yarn--3" />
            </div>
          </div>
        </section>
      )}

      <section className="container catalog" id="catalogo">
        <CategorySidebar
          categorias={categorias}
          activa={categoria}
          tipo={tipo}
          onCategoria={(v) => cambiar('categoria', v)}
          onTipo={(v) => cambiar('tipo', v)}
        />

        <div className="catalog__content">
          <div className="catalog__head">
            <div>
              <h2>{q ? `Resultados para “${q}”` : nombreCategoria || 'Todos los cursos'}</h2>
              <p className="muted">
                {cargando ? 'Buscando…' : `${cursos.length} ${cursos.length === 1 ? 'curso' : 'cursos'}`}
              </p>
            </div>
            {hayFiltros && (
              <button className="btn btn--ghost btn--sm" onClick={() => setParams({})}>
                Limpiar filtros
              </button>
            )}
          </div>

          {error && <div className="alert alert--error">{error}</div>}
          {cargando ? (
            <Loader />
          ) : cursos.length === 0 ? (
            <div className="empty">
              <span className="empty__icon">🧶</span>
              <h3>No encontramos cursos</h3>
              <p>Prueba con otra palabra o quita los filtros.</p>
            </div>
          ) : (
            <div className="grid">
              {cursos.map((c) => (
                <CourseCard key={c.id} curso={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
