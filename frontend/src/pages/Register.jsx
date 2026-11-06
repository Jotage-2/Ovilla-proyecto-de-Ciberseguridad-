// Registro de nuevos clientes
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const desde = location.state?.desde;

  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.');
    setEnviando(true);
    try {
      await registro(form.nombre, form.email, form.password);
      navigate(desde || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={enviar}>
        <h1>Crea tu cuenta</h1>
        <p className="muted">Es gratis y accedes al instante a los cursos gratuitos.</p>
        {error && <div className="alert alert--error">{error}</div>}

        <label className="field">
          <span>Nombre completo</span>
          <input name="nombre" value={form.nombre} onChange={cambiar} required autoComplete="name" />
        </label>
        <label className="field">
          <span>Correo electrónico</span>
          <input name="email" type="email" value={form.email} onChange={cambiar} required autoComplete="email" />
        </label>
        <label className="field">
          <span>Contraseña (mínimo 6 caracteres)</span>
          <input name="password" type="password" minLength={6} value={form.password} onChange={cambiar} required autoComplete="new-password" />
        </label>
        <label className="field">
          <span>Repite la contraseña</span>
          <input name="confirmar" type="password" value={form.confirmar} onChange={cambiar} required autoComplete="new-password" />
        </label>

        <button className="btn btn--primary btn--block" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Registrarme'}
        </button>
        <p className="auth__alt">
          ¿Ya tienes cuenta? <Link to="/entrar" state={{ desde }}>Entra aquí</Link>
        </p>
      </form>
    </div>
  );
}
