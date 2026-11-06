// Estructura del panel del dueño (menú lateral + contenido)
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="container admin">
      <aside className="admin__nav">
        <span className="eyebrow">Panel del dueño</span>
        <NavLink to="/admin" end className="admin__link">📊 Resumen</NavLink>
        <NavLink to="/admin/cursos" end className="admin__link">📚 Cursos</NavLink>
        <NavLink to="/admin/cursos/nuevo" className="admin__link">➕ Nuevo curso</NavLink>
        <NavLink to="/admin/clientes" className="admin__link">👥 Clientes</NavLink>
      </aside>
      <section className="admin__content">
        <Outlet />
      </section>
    </div>
  );
}
