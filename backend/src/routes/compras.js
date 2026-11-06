// Proceso de compra y "Mis cursos" del cliente
import { Router } from 'express';
import crypto from 'node:crypto';
import { getDb } from '../db.js';
import { requiereSesion } from '../middleware/auth.js';
import { formatearCurso } from './cursos.js';

const router = Router();
const METODOS = ['tarjeta', 'yape', 'plin'];

// POST /api/compras  { curso_id, metodo, ultimos4 }
// IMPORTANTE: es un pago SIMULADO. Para cobrar de verdad hay que conectar una pasarela
// (Mercado Pago, Culqi, Izipay, Stripe...) y registrar la compra solo cuando la pasarela confirme el pago.
router.post('/', requiereSesion, async (req, res) => {
  if (req.usuario.rol === 'admin') {
    return res.status(400).json({ error: 'El dueño ya tiene acceso a todos los cursos.' });
  }

  const cursoId = Number(req.body?.curso_id);
  const metodo = METODOS.includes(req.body?.metodo) ? req.body.metodo : 'tarjeta';
  const ultimos4 = String(req.body?.ultimos4 || '').replace(/\D/g, '').slice(-4);

  const db = getDb();
  const curso = await db.prepare('SELECT * FROM cursos WHERE id = ?').get(cursoId);
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado.' });
  if (curso.es_gratis) return res.status(400).json({ error: 'Este curso es gratuito, no necesitas comprarlo.' });

  const ya = await db.prepare('SELECT id FROM compras WHERE usuario_id = ? AND curso_id = ?').get(req.usuario.id, cursoId);
  if (ya) return res.status(409).json({ error: 'Ya compraste este curso.' });

  const referencia = `OV-${crypto.randomBytes(4).toString('hex').toUpperCase()}${ultimos4 ? '-' + ultimos4 : ''}`;
  const r = await db
    .prepare('INSERT INTO compras (usuario_id, curso_id, monto, metodo, referencia) VALUES (?, ?, ?, ?, ?)')
    .run(req.usuario.id, cursoId, curso.precio, metodo, referencia);

  res.status(201).json({
    id: Number(r.lastInsertRowid),
    curso_id: cursoId,
    monto: curso.precio,
    metodo,
    referencia,
    mensaje: '¡Compra realizada! El curso ya está desbloqueado.',
  });
});

// GET /api/compras/mis-cursos
router.get('/mis-cursos', requiereSesion, async (req, res) => {
  const filas = await getDb()
    .prepare(`
      SELECT c.id, c.titulo, c.descripcion, c.autor, c.precio, c.es_gratis, c.imagen,
             c.nivel, c.duracion, c.categoria_id, c.creado_en,
             cat.nombre AS categoria, cat.slug AS categoria_slug,
             (SELECT COUNT(*) FROM lecciones l WHERE l.curso_id = c.id) AS total_lecciones,
             co.creado_en AS fecha_compra, co.monto AS monto_pagado, co.referencia
      FROM compras co
      JOIN cursos c ON c.id = co.curso_id
      LEFT JOIN categorias cat ON cat.id = c.categoria_id
      WHERE co.usuario_id = ?
      ORDER BY co.creado_en DESC, co.id DESC
    `)
    .all(req.usuario.id);

  const compradas = new Set(filas.map((f) => f.id));
  res.json(filas.map((f) => formatearCurso(f, compradas)));
});

export default router;
