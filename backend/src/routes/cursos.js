// Catálogo público de cursos y categorías
import { Router } from 'express';
import { getDb } from '../db.js';
import { sesionOpcional } from '../middleware/auth.js';

const router = Router();

const SELECT_CURSO = `
  SELECT c.id, c.titulo, c.descripcion, c.autor, c.precio, c.es_gratis, c.imagen,
         c.nivel, c.duracion, c.categoria_id, c.creado_en,
         cat.nombre AS categoria, cat.slug AS categoria_slug,
         (SELECT COUNT(*) FROM lecciones l WHERE l.curso_id = c.id) AS total_lecciones
  FROM cursos c
  LEFT JOIN categorias cat ON cat.id = c.categoria_id
`;

// ¿El usuario puede ver el contenido de este curso?
export async function tieneAcceso(usuario, curso) {
  if (curso.es_gratis) return true;
  if (!usuario) return false;
  if (usuario.rol === 'admin') return true;
  return !!(await getDb()
    .prepare('SELECT 1 FROM compras WHERE usuario_id = ? AND curso_id = ?')
    .get(usuario.id, curso.id));
}

async function comprasDe(usuario) {
  if (!usuario) return new Set();
  const filas = await getDb().prepare('SELECT curso_id FROM compras WHERE usuario_id = ?').all(usuario.id);
  return new Set(filas.map((f) => f.curso_id));
}

export function formatearCurso(c, compradas = new Set()) {
  return {
    ...c,
    es_gratis: !!c.es_gratis,
    comprado: compradas.has(c.id),
  };
}

// GET /api/categorias
router.get('/categorias', async (_req, res) => {
  const categorias = await getDb()
    .prepare(`
      SELECT cat.id, cat.nombre, cat.slug, cat.icono, COUNT(c.id) AS total
      FROM categorias cat
      LEFT JOIN cursos c ON c.categoria_id = cat.id
      GROUP BY cat.id
      ORDER BY cat.id
    `)
    .all();
  res.json(categorias);
});

// GET /api/cursos?q=texto&categoria=slug&tipo=gratis|pago
router.get('/cursos', sesionOpcional, async (req, res) => {
  const filtros = [];
  const valores = [];

  const q = String(req.query.q || '').trim();
  if (q) {
    filtros.push('LOWER(c.titulo) LIKE ?');
    valores.push(`%${q.toLowerCase()}%`);
  }
  if (req.query.categoria) {
    filtros.push('cat.slug = ?');
    valores.push(String(req.query.categoria));
  }
  if (req.query.tipo === 'gratis') filtros.push('c.es_gratis = 1');
  if (req.query.tipo === 'pago') filtros.push('c.es_gratis = 0');

  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
  const cursos = await getDb().prepare(`${SELECT_CURSO} ${where} ORDER BY c.creado_en DESC, c.id DESC`).all(...valores);

  const compradas = await comprasDe(req.usuario);
  res.json(cursos.map((c) => formatearCurso(c, compradas)));
});

// GET /api/cursos/:id  -> detalle; el contenido de las lecciones solo si tiene acceso
router.get('/cursos/:id', sesionOpcional, async (req, res) => {
  const db = getDb();
  const curso = await db.prepare(`${SELECT_CURSO} WHERE c.id = ?`).get(Number(req.params.id));
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado.' });

  const acceso = await tieneAcceso(req.usuario, curso);
  const lecciones = (await db
    .prepare('SELECT id, orden, titulo, contenido, video_url FROM lecciones WHERE curso_id = ? ORDER BY orden, id')
    .all(curso.id))
    .map((l) => (acceso ? l : { id: l.id, orden: l.orden, titulo: l.titulo, bloqueada: true }));

  res.json({ ...formatearCurso(curso, await comprasDe(req.usuario)), acceso, lecciones });
});

export default router;
