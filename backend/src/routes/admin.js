// Panel del dueño: resumen, gestión de cursos, imágenes y clientes
import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getDb, transaction } from '../db.js';
import { requiereAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requiereAdmin);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');

// ---------- Subida de imágenes de portada ----------
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${Date.now()}-${crypto.randomBytes(3).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
    cb(ok ? null : new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.'), ok);
  },
});

// POST /api/admin/imagen  (campo "imagen")
router.post('/imagen', async (req, res) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'La imagen pesa más de 5 MB.' : err.message });
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

// ---------- Resumen ----------
router.get('/resumen', async (_req, res) => {
  const db = getDb();
  const uno = async (sql) => Object.values(await db.prepare(sql).get())[0];
  res.json({
    cursos: await uno('SELECT COUNT(*) FROM cursos'),
    cursos_pago: await uno('SELECT COUNT(*) FROM cursos WHERE es_gratis = 0'),
    clientes: await uno("SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente'"),
    ventas: await uno('SELECT COUNT(*) FROM compras'),
    ingresos: await uno('SELECT COALESCE(SUM(monto), 0) FROM compras'),
    ultimas_ventas: await db
      .prepare(`
        SELECT co.id, co.monto, co.creado_en, co.referencia, u.nombre AS cliente, c.titulo AS curso
        FROM compras co
        JOIN usuarios u ON u.id = co.usuario_id
        JOIN cursos c ON c.id = co.curso_id
        ORDER BY co.creado_en DESC, co.id DESC LIMIT 8
      `)
      .all(),
  });
});

// ---------- Cursos ----------
function validarCurso(body) {
  const titulo = String(body?.titulo || '').trim();
  const autor = String(body?.autor || '').trim();
  const es_gratis = body?.es_gratis ? 1 : 0;
  const precio = es_gratis ? 0 : Number(body?.precio);

  if (titulo.length < 3) return { error: 'El título debe tener al menos 3 caracteres.' };
  if (!autor) return { error: 'Indica el autor del curso.' };
  if (!es_gratis && (!Number.isFinite(precio) || precio <= 0)) return { error: 'Un curso de pago necesita un precio mayor a 0.' };

  const lecciones = Array.isArray(body?.lecciones) ? body.lecciones : [];
  const leccionesLimpias = lecciones
    .map((l, i) => ({
      orden: i + 1,
      titulo: String(l?.titulo || '').trim(),
      contenido: String(l?.contenido || '').trim(),
      video_url: String(l?.video_url || '').trim(),
    }))
    .filter((l) => l.titulo);

  return {
    datos: {
      titulo,
      autor,
      es_gratis,
      precio: Math.round(precio * 100) / 100,
      descripcion: String(body?.descripcion || '').trim(),
      imagen: String(body?.imagen || '').trim(),
      nivel: String(body?.nivel || 'Principiante').trim(),
      duracion: String(body?.duracion || '').trim(),
      categoria_id: body?.categoria_id ? Number(body.categoria_id) : null,
    },
    lecciones: leccionesLimpias,
  };
}

async function guardarLecciones(db, cursoId, lecciones) {
  await db.prepare('DELETE FROM lecciones WHERE curso_id = ?').run(cursoId);
  const insert = db.prepare('INSERT INTO lecciones (curso_id, orden, titulo, contenido, video_url) VALUES (?, ?, ?, ?, ?)');
  for (const l of lecciones) await insert.run(cursoId, l.orden, l.titulo, l.contenido, l.video_url);
}

// GET /api/admin/cursos
router.get('/cursos', async (_req, res) => {
  const cursos = (await getDb()
    .prepare(`
      SELECT c.*, cat.nombre AS categoria,
             (SELECT COUNT(*) FROM lecciones l WHERE l.curso_id = c.id) AS total_lecciones,
             (SELECT COUNT(*) FROM compras co WHERE co.curso_id = c.id) AS ventas,
             (SELECT COALESCE(SUM(monto), 0) FROM compras co WHERE co.curso_id = c.id) AS ingresos
      FROM cursos c
      LEFT JOIN categorias cat ON cat.id = c.categoria_id
      ORDER BY c.creado_en DESC, c.id DESC
    `)
    .all())
    .map((c) => ({ ...c, es_gratis: !!c.es_gratis }));
  res.json(cursos);
});

// GET /api/admin/cursos/:id  (con lecciones completas, para editar)
router.get('/cursos/:id', async (req, res) => {
  const db = getDb();
  const curso = await db.prepare('SELECT * FROM cursos WHERE id = ?').get(Number(req.params.id));
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado.' });
  const lecciones = await db
    .prepare('SELECT id, orden, titulo, contenido, video_url FROM lecciones WHERE curso_id = ? ORDER BY orden, id')
    .all(curso.id);
  res.json({ ...curso, es_gratis: !!curso.es_gratis, lecciones });
});

// POST /api/admin/cursos
router.post('/cursos', async (req, res) => {
  const v = validarCurso(req.body);
  if (v.error) return res.status(400).json({ error: v.error });
  const d = v.datos;

  const id = await transaction(async (db) => {
    const r = await db
      .prepare(`INSERT INTO cursos (titulo, descripcion, autor, precio, es_gratis, imagen, nivel, duracion, categoria_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(d.titulo, d.descripcion, d.autor, d.precio, d.es_gratis, d.imagen, d.nivel, d.duracion, d.categoria_id);
    const nuevoId = Number(r.lastInsertRowid);
    await guardarLecciones(db, nuevoId, v.lecciones);
    return nuevoId;
  });

  res.status(201).json({ id, mensaje: 'Curso creado.' });
});

// PUT /api/admin/cursos/:id
router.put('/cursos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!(await getDb().prepare('SELECT id FROM cursos WHERE id = ?').get(id))) {
    return res.status(404).json({ error: 'Curso no encontrado.' });
  }
  const v = validarCurso(req.body);
  if (v.error) return res.status(400).json({ error: v.error });
  const d = v.datos;

  await transaction(async (db) => {
    await db.prepare(`UPDATE cursos SET titulo = ?, descripcion = ?, autor = ?, precio = ?, es_gratis = ?,
                imagen = ?, nivel = ?, duracion = ?, categoria_id = ? WHERE id = ?`)
      .run(d.titulo, d.descripcion, d.autor, d.precio, d.es_gratis, d.imagen, d.nivel, d.duracion, d.categoria_id, id);
    await guardarLecciones(db, id, v.lecciones);
  });

  res.json({ id, mensaje: 'Curso actualizado.' });
});

// DELETE /api/admin/cursos/:id
router.delete('/cursos/:id', async (req, res) => {
  const r = await getDb().prepare('DELETE FROM cursos WHERE id = ?').run(Number(req.params.id));
  if (!r.changes) return res.status(404).json({ error: 'Curso no encontrado.' });
  res.json({ mensaje: 'Curso eliminado.' });
});

// ---------- Clientes ----------
// GET /api/admin/clientes?q=texto
router.get('/clientes', async (req, res) => {
  const db = getDb();
  const q = String(req.query.q || '').trim().toLowerCase();
  const clientes = await db
    .prepare(`
      SELECT u.id, u.nombre, u.email, u.creado_en,
             COUNT(co.id) AS cursos_comprados,
             COALESCE(SUM(co.monto), 0) AS total_gastado
      FROM usuarios u
      LEFT JOIN compras co ON co.usuario_id = u.id
      WHERE u.rol = 'cliente' AND (LOWER(u.nombre) LIKE ? OR LOWER(u.email) LIKE ?)
      GROUP BY u.id
      ORDER BY u.creado_en DESC, u.id DESC
    `)
    .all(`%${q}%`, `%${q}%`);

  const comprasStmt = db.prepare(`
    SELECT co.id, co.monto, co.creado_en, co.referencia, c.titulo AS curso
    FROM compras co JOIN cursos c ON c.id = co.curso_id
    WHERE co.usuario_id = ? ORDER BY co.creado_en DESC
  `);
  res.json(await Promise.all(clientes.map(async (c) => ({ ...c, compras: await comprasStmt.all(c.id) }))));
});

export default router;
