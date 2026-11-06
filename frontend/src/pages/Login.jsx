// Inicio de sesión
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const desde = location.state?.desde;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const u = await login(email, password);
      const soloClientes = desde && /^\/(mis-cursos|comprar)/.test(desde);
      const destino = u.rol === 'admin' ? (desde && !soloClientes ? desde : '/admin') : desde || '/';
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={enviar}>
        <h1>Bienvenida de vuelta</h1>
        <p className="muted">Entra para ver tus cursos.</p>
        {error && <div className="alert alert--error">{error}</div>}

        <label className="field">
          <span>Correo electrónico</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="field">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>

        <button className="btn btn--primary btn--block" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="auth__alt">
          ¿No tienes cuenta? <Link to="/registro" state={{ desde }}>Regístrate gratis</Link>
        </p>
      </form>
    </div>
  );
}
