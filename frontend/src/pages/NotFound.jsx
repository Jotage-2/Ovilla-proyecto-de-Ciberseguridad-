import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty">
        <span className="empty__icon">🧵</span>
        <h3>Página no encontrada</h3>
        <p>Parece que este hilo se soltó.</p>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
