// Barra superior: logo, buscador y menú de usuario
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { usuario, esAdmin, logout } = useAuth();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [texto, setTexto] = useState(params.get('q') || '');
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    setTexto(location.pathname === '/' ? params.get('q') || '' : '');
    setMenuAbierto(false);
  }, [location.pathname, params]);

  const buscar = (e) => {
    e.preventDefault();
    const nuevos = new URLSearchParams(location.pathname === '/' ? params : undefined);
    if (texto.trim()) nuevos.set('q', texto.trim());
    else nuevos.delete('q');
    navigate(`/?${nuevos.toString()}`);
  };

  const salir = () => {
    navigate('/', { replace: true });
    logout();
  };

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" aria-label="Ovilla, inicio">
          <Logo />
        </Link>

        <form className="search" onSubmit={buscar} role="search">
          <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Busca un curso: amigurumi, bolso, granny…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-label="Buscar cursos por nombre"
          />
          <button type="submit" className="btn btn--primary btn--sm">Buscar</button>
        </form>

        <button className="navbar__toggle" onClick={() => setMenuAbierto((v) => !v)} aria-label="Abrir menú">
          <span /><span /><span />
        </button>

        <nav className={`navbar__menu ${menuAbierto ? 'is-open' : ''}`}>
          <NavLink to="/" end className="navbar__link">Catálogo</NavLink>
          {usuario && !esAdmin && <NavLink to="/mis-cursos" className="navbar__link">Mis cursos</NavLink>}
          {esAdmin && <NavLink to="/admin" className="navbar__link">Panel del dueño</NavLink>}

          {usuario ? (
            <div className="navbar__user">
              <span className="avatar" title={usuario.email}>{usuario.nombre.charAt(0).toUpperCase()}</span>
              <span className="navbar__username">{usuario.nombre.split(' ')[0]}</span>
              <button className="btn btn--ghost btn--sm" onClick={salir}>Salir</button>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/entrar" className="btn btn--ghost btn--sm">Entrar</Link>
              <Link to="/registro" className="btn btn--primary btn--sm">Registrarse</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
