// Verificación de sesión (token JWT) y permisos
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ovilla-clave-de-desarrollo';

export function crearToken(usuario) {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '7d' });
}

async function leerUsuario(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  let payload;
  try { payload = jwt.verify(token, JWT_SECRET); }
  catch { return null; }
  return (await getDb()
    .prepare('SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?')
    .get(payload.id)) || null;
}

// Agrega req.usuario si hay sesión, pero deja pasar igual (para el catálogo público)
export async function sesionOpcional(req, _res, next) {
  req.usuario = await leerUsuario(req);
  next();
}

// Exige haber iniciado sesión
export async function requiereSesion(req, res, next) {
  req.usuario = await leerUsuario(req);
  if (!req.usuario) return res.status(401).json({ error: 'Debes iniciar sesión.' });
  next();
}

// Exige ser el dueño (admin)
export async function requiereAdmin(req, res, next) {
  req.usuario = await leerUsuario(req);
  if (!req.usuario) return res.status(401).json({ error: 'Debes iniciar sesión.' });
  if (req.usuario.rol !== 'admin') return res.status(403).json({ error: 'No tienes permiso.' });
  next();
}
