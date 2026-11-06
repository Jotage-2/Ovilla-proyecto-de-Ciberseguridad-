// Resumen de ventas y números clave
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatoFecha, formatoPrecio } from '../../api.js';
import Loader from '../../components/Loader.jsx';

export default function AdminDashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.resumen().then(setDatos).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert alert--error">{error}</div>;
  if (!datos) return <Loader />;

  const tarjetas = [
    ['Ingresos totales', formatoPrecio(datos.ingresos)],
    ['Ventas', datos.ventas],
    ['Clientes registrados', datos.clientes],
    ['Cursos publicados', `${datos.cursos} (${datos.cursos_pago} de pago)`],
  ];

  return (
    <>
      <div className="page__head page__head--row">
        <h1>Resumen</h1>
        <Link to="/admin/cursos/nuevo" className="btn btn--primary">+ Nuevo curso</Link>
      </div>

      <div className="stats">
        {tarjetas.map(([titulo, valor]) => (
          <div className="stat" key={titulo}>
            <span className="stat__label">{titulo}</span>
            <strong className="stat__value">{valor}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>Últimas ventas</h3>
        {datos.ultimas_ventas.length === 0 ? (
          <p className="muted">Todavía no hay ventas.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Fecha</th><th>Cliente</th><th>Curso</th><th>Código</th><th className="num">Monto</th></tr>
              </thead>
              <tbody>
                {datos.ultimas_ventas.map((v) => (
                  <tr key={v.id}>
                    <td>{formatoFecha(v.creado_en)}</td>
                    <td>{v.cliente}</td>
                    <td>{v.curso}</td>
                    <td className="muted">{v.referencia}</td>
                    <td className="num">{formatoPrecio(v.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
