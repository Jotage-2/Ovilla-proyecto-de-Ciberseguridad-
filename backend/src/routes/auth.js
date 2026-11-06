// Rutas de registro, inicio de sesión y usuario actual
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { crearToken, requiereSesion } from '../middleware/auth.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function usuarioPublico(u) {
  return { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, creado_en: u.creado_en };
}

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  const nombre = String(req.body?.nombre || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (nombre.length < 2) return res.status(400).json({ error: 'Escribe tu nombre.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'El correo no es válido.' });
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });

  const db = getDb();
  if (await db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const r = await db
    .prepare("INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, 'cliente')")
    .run(nombre, email, hash);
  const usuario = await db.prepare('SELECT * FROM usuarios WHERE id = ?').get(r.lastInsertRowid);

  res.status(201).json({ token: crearToken(usuario), usuario: usuarioPublico(usuario) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  const usuario = await getDb().prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!usuario || !bcrypt.compareSync(password, usuario.password_hash)) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }
  res.json({ token: crearToken(usuario), usuario: usuarioPublico(usuario) });
});

// GET /api/auth/yo  -> datos del usuario con sesión activa
router.get('/yo', requiereSesion, async (req, res) => {
  res.json({ usuario: req.usuario });
});

export default router;
