// Proceso de compra (pago simulado, listo para conectar una pasarela real)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatoPrecio } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseImage from '../components/CourseImage.jsx';
import Loader from '../components/Loader.jsx';

const formatearTarjeta = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatearVence = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function Checkout() {
  const { id } = useParams();
  const { usuario, esAdmin } = useAuth();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [metodo, setMetodo] = useState('tarjeta');
  const [tarjeta, setTarjeta] = useState({ titular: usuario?.nombre || '', numero: '', vence: '', cvv: '' });
  const [celular, setCelular] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    api.curso(id).then(setCurso).catch((e) => setError(e.message));
  }, [id]);

  if (error && !curso) return <div className="container page"><div className="alert alert--error">{error}</div></div>;
  if (!curso) return <Loader />;

  if (curso.es_gratis || curso.comprado || esAdmin) {
    return (
      <div className="container page narrow">
        <div className="alert">
          {curso.es_gratis ? 'Este curso es gratuito.' : 'Ya tienes acceso a este curso.'}{' '}
          <Link to={`/curso/${curso.id}`}>Ir al curso</Link>
        </div>
      </div>
    );
  }

  const validar = () => {
    if (metodo === 'tarjeta') {
      if (tarjeta.titular.trim().length < 3) return 'Escribe el nombre del titular.';
      if (tarjeta.numero.replace(/\s/g, '').length !== 16) return 'El número de tarjeta debe tener 16 dígitos.';
      const [mm, aa] = tarjeta.vence.split('/').map(Number);
      if (!mm || mm > 12 || !aa) return 'La fecha de vencimiento no es válida (MM/AA).';
      const ahora = new Date();
      if (2000 + aa < ahora.getFullYear() || (2000 + aa === ahora.getFullYear() && mm < ahora.getMonth() + 1)) {
        return 'La tarjeta está vencida.';
      }
      if (!/^\d{3,4}$/.test(tarjeta.cvv)) return 'El CVV debe tener 3 o 4 dígitos.';
    } else if (!/^9\d{8}$/.test(celular)) {
      return 'Escribe un número de celular válido de 9 dígitos.';
    }
    return '';
  };

  const pagar = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);
    setError('');
    setProcesando(true);
    try {
      // Simula el tiempo de respuesta de una pasarela de pago
      await new Promise((r) => setTimeout(r, 1200));
      const ultimos4 = metodo === 'tarjeta' ? tarjeta.numero.replace(/\s/g, '').slice(-4) : celular.slice(-4);
      // Nunca se envían los datos completos de la tarjeta al servidor
      const r = await api.comprar({ curso_id: curso.id, metodo, ultimos4 });
      setExito(r);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  if (exito) {
    return (
      <div className="container page narrow">
        <div className="success">
          <span className="success__icon">🎉</span>
          <h1>¡Compra exitosa!</h1>
          <p>Ya puedes empezar <strong>{curso.titulo}</strong>.</p>
          <p className="muted">Código de compra: {exito.referencia}</p>
          <div className="success__actions">
            <button className="btn btn--primary" onClick={() => navigate(`/curso/${curso.id}`)}>Empezar el curso</button>
            <Link className="btn btn--ghost" to="/mis-cursos">Ver mis cursos</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to={`/curso/${curso.id}`} className="back">← Volver al curso</Link>
      <h1>Finalizar compra</h1>

      <div className="checkout">
        <form className="panel" onSubmit={pagar}>
          <div className="demo-note">
            🧪 <strong>Modo demostración:</strong> no se realiza ningún cobro real. Usa cualquier tarjeta de prueba,
            por ejemplo 4242 4242 4242 4242.
          </div>

          <h3>Método de pago</h3>
          <div className="pay-methods">
            {[
              ['tarjeta', '💳 Tarjeta'],
              ['yape', '📱 Yape'],
              ['plin', '📲 Plin'],
            ].map(([valor, etiqueta]) => (
              <button type="button" key={valor} className={`pay-method ${metodo === valor ? 'is-active' : ''}`}
                onClick={() => { setMetodo(valor); setError(''); }}>
                {etiqueta}
              </button>
            ))}
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          {metodo === 'tarjeta' ? (
            <>
              <label className="field">
                <span>Nombre del titular</span>
                <input value={tarjeta.titular} onChange={(e) => setTarjeta({ ...tarjeta, titular: e.target.value })} autoComplete="cc-name" />
              </label>
              <label className="field">
                <span>Número de tarjeta</span>
                <input inputMode="numeric" placeholder="0000 0000 0000 0000" value={tarjeta.numero}
                  onChange={(e) => setTarjeta({ ...tarjeta, numero: formatearTarjeta(e.target.value) })} autoComplete="cc-number" />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Vencimiento</span>
                  <input inputMode="numeric" placeholder="MM/AA" value={tarjeta.vence}
                    onChange={(e) => setTarjeta({ ...tarjeta, vence: formatearVence(e.target.value) })} autoComplete="cc-exp" />
                </label>
                <label className="field">
                  <span>CVV</span>
                  <input inputMode="numeric" placeholder="123" value={tarjeta.cvv}
                    onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} autoComplete="cc-csc" />
                </label>
              </div>
            </>
          ) : (
            <label className="field">
              <span>Celular asociado a {metodo === 'yape' ? 'Yape' : 'Plin'}</span>
              <input inputMode="numeric" placeholder="9XX XXX XXX" value={celular}
                onChange={(e) => setCelular(e.target.value.replace(/\D/g, '').slice(0, 9))} />
            </label>
          )}

          <button className="btn btn--primary btn--block btn--lg" disabled={procesando}>
            {procesando ? 'Procesando pago…' : `Pagar ${formatoPrecio(curso.precio)}`}
          </button>
        </form>

        <aside className="panel summary">
          <h3>Resumen</h3>
          <div className="summary__course">
            <CourseImage src={curso.imagen} alt={curso.titulo} className="summary__img" />
            <div>
              <strong>{curso.titulo}</strong>
              <p className="muted">por {curso.autor}</p>
            </div>
          </div>
          <div className="summary__row"><span>Precio</span><span>{formatoPrecio(curso.precio)}</span></div>
          <div className="summary__row summary__total"><span>Total</span><span>{formatoPrecio(curso.precio)}</span></div>
          <ul className="summary__perks">
            <li>✓ {curso.total_lecciones} lecciones</li>
            <li>✓ Acceso de por vida</li>
            <li>✓ Aprende a tu ritmo</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
