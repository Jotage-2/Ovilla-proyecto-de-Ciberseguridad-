// Lista de clientes registrados y sus compras
import { Fragment, useEffect, useState } from 'react';
import { api, formatoFecha, formatoPrecio } from '../../api.js';
import Loader from '../../components/Loader.jsx';

export default function AdminClients() {
  const [clientes, setClientes] = useState(null);
  const [q, setQ] = useState('');
  const [abierto, setAbierto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      api.clientes(q).then(setClientes).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <div className="page__head">
        <h1>Clientes</h1>
        <p className="muted">{clientes ? `${clientes.length} clientes registrados` : ''}</p>
      </div>
      {error && <div className="alert alert--error">{error}</div>}

      <div className="panel">
        <input className="input" placeholder="Buscar por nombre o correo…" value={q} onChange={(e) => setQ(e.target.value)} />
        {!clientes ? (
          <Loader />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Cliente</th><th>Correo</th><th>Registro</th><th className="num">Cursos</th><th className="num">Total gastado</th><th /></tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <Fragment key={c.id}>
                    <tr>
                      <td>
                        <div className="table__course">
                          <span className="avatar">{c.nombre.charAt(0).toUpperCase()}</span>
                          <strong>{c.nombre}</strong>
                        </div>
                      </td>
                      <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                      <td>{formatoFecha(c.creado_en)}</td>
                      <td className="num">{c.cursos_comprados}</td>
                      <td className="num">{formatoPrecio(c.total_gastado)}</td>
                      <td className="actions">
                        {c.compras.length > 0 && (
                          <button className="btn btn--ghost btn--sm" onClick={() => setAbierto(abierto === c.id ? null : c.id)}>
                            {abierto === c.id ? 'Ocultar' : 'Ver compras'}
                          </button>
                        )}
                      </td>
                    </tr>
                    {abierto === c.id && (
                      <tr className="table__sub">
                        <td colSpan={6}>
                          <ul className="purchases">
                            {c.compras.map((p) => (
                              <li key={p.id}>
                                <span>{p.curso}</span>
                                <span className="muted">{formatoFecha(p.creado_en)} · {p.referencia}</span>
                                <strong>{formatoPrecio(p.monto)}</strong>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {clientes.length === 0 && <tr><td colSpan={6} className="muted">No se encontraron clientes.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
