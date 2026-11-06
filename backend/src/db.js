// Conexión a PostgreSQL. DATABASE_URL se configura en backend/.env.
import pg from 'pg';

// PostgreSQL devuelve COUNT como texto por defecto; Ovilla lo usa como número.
pg.types.setTypeParser(20, (value) => Number(value));
let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL en backend/.env.');
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PG_SSL === 'false' ? false : { rejectUnauthorized: true } });
  }
  return pool;
}

function adapter(connection) {
  return {
    prepare(sql) {
      let i = 0;
      const query = sql.replace(/\?/g, () => `$${++i}`);
      return {
        async get(...values) { return (await connection.query(query, values)).rows[0]; },
        async all(...values) { return (await connection.query(query, values)).rows; },
        async run(...values) {
          const insert = /^\s*INSERT\s/i.test(query);
          const result = await connection.query(insert ? `${query} RETURNING id` : query, values);
          return { changes: result.rowCount, lastInsertRowid: result.rows[0]?.id };
        },
      };
    },
  };
}
export function getDb() { return adapter(getPool()); }
export async function initDatabase() { await getPool().query('SELECT 1'); }
export async function closeDatabase() { if (pool) await pool.end(); }
export async function transaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(adapter(client));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
