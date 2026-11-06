// Barra lateral de categorías y filtro gratis/pago
export default function CategorySidebar({ categorias, activa, tipo, onCategoria, onTipo }) {
  const total = categorias.reduce((s, c) => s + c.total, 0);

  return (
    <aside className="sidebar">
      <div className="sidebar__group">
        <h4 className="sidebar__title">Categorías</h4>
        <ul className="sidebar__list">
          <li>
            <button className={`sidebar__item ${!activa ? 'is-active' : ''}`} onClick={() => onCategoria('')}>
              <span className="sidebar__icon">✨</span>
              <span>Todos los cursos</span>
              <span className="sidebar__count">{total}</span>
            </button>
          </li>
          {categorias.map((c) => (
            <li key={c.id}>
              <button
                className={`sidebar__item ${activa === c.slug ? 'is-active' : ''}`}
                onClick={() => onCategoria(c.slug)}
              >
                <span className="sidebar__icon">{c.icono}</span>
                <span>{c.nombre}</span>
                <span className="sidebar__count">{c.total}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar__group">
        <h4 className="sidebar__title">Precio</h4>
        <div className="chips">
          {[
            ['', 'Todos'],
            ['gratis', 'Gratis'],
            ['pago', 'De pago'],
          ].map(([valor, etiqueta]) => (
            <button
              key={valor || 'todos'}
              className={`chip ${tipo === valor ? 'is-active' : ''}`}
              onClick={() => onTipo(valor)}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
