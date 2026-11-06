-- =========================================================
--  OVILLA - Estructura de la base de datos (SQLite)
-- =========================================================

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS lecciones;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

-- Usuarios: clientes y el dueño (rol 'admin')
CREATE TABLE usuarios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  rol           TEXT    NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
  creado_en     TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Categorías que aparecen en la barra lateral
CREATE TABLE categorias (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  slug   TEXT NOT NULL UNIQUE,
  icono  TEXT NOT NULL DEFAULT '🧶'
);

-- Cursos (gratuitos o de pago)
CREATE TABLE cursos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo       TEXT    NOT NULL,
  descripcion  TEXT    NOT NULL DEFAULT '',
  autor        TEXT    NOT NULL,
  precio       REAL    NOT NULL DEFAULT 0,
  es_gratis    INTEGER NOT NULL DEFAULT 0 CHECK (es_gratis IN (0, 1)),
  imagen       TEXT    NOT NULL DEFAULT '',
  nivel        TEXT    NOT NULL DEFAULT 'Principiante',
  duracion     TEXT    NOT NULL DEFAULT '',
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  creado_en    TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Lecciones de cada curso (el contenido que se desbloquea)
CREATE TABLE lecciones (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  curso_id  INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  orden     INTEGER NOT NULL DEFAULT 1,
  titulo    TEXT    NOT NULL,
  contenido TEXT    NOT NULL DEFAULT '',
  video_url TEXT    NOT NULL DEFAULT ''
);

-- Compras: qué cliente compró qué curso
CREATE TABLE compras (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id   INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  monto      REAL    NOT NULL,
  metodo     TEXT    NOT NULL DEFAULT 'tarjeta',
  referencia TEXT    NOT NULL DEFAULT '',
  creado_en  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
  UNIQUE (usuario_id, curso_id)
);

CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX idx_lecciones_curso  ON lecciones(curso_id);
CREATE INDEX idx_compras_usuario  ON compras(usuario_id);
