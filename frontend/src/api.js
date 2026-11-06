// Funciones para comunicarse con el backend
const TOKEN_KEY = 'ovilla_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respuesta sin cuerpo */
  }
  if (!res.ok) {
    const err = new Error(data?.error || 'No se pudo conectar con el servidor.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // Autenticación
  registro: (datos) => request('/auth/registro', { method: 'POST', body: datos }),
  login: (datos) => request('/auth/login', { method: 'POST', body: datos }),
  yo: () => request('/auth/yo'),

  // Catálogo
  categorias: () => request('/categorias'),
  cursos: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/cursos${qs ? `?${qs}` : ''}`);
  },
  curso: (id) => request(`/cursos/${id}`),

  // Compras
  comprar: (datos) => request('/compras', { method: 'POST', body: datos }),
  misCursos: () => request('/compras/mis-cursos'),

  // Panel del dueño
  resumen: () => request('/admin/resumen'),
  adminCursos: () => request('/admin/cursos'),
  adminCurso: (id) => request(`/admin/cursos/${id}`),
  crearCurso: (datos) => request('/admin/cursos', { method: 'POST', body: datos }),
  editarCurso: (id, datos) => request(`/admin/cursos/${id}`, { method: 'PUT', body: datos }),
  eliminarCurso: (id) => request(`/admin/cursos/${id}`, { method: 'DELETE' }),
  clientes: (q = '') => request(`/admin/clientes${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  subirImagen: (archivo) => {
    const fd = new FormData();
    fd.append('imagen', archivo);
    return request('/admin/imagen', { method: 'POST', body: fd, isForm: true });
  },
};

export const formatoPrecio = (n) =>
  `S/ ${Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatoFecha = (s) => {
  if (!s) return '';
  const d = new Date(s.replace(' ', 'T'));
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};
