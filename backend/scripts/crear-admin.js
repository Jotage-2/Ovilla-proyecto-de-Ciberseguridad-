// Crea una cuenta de dueño (admin) o cambia su contraseña si el correo ya existe.
// Uso (desde la carpeta ovilla):
//   npm run crear-admin -- tucorreo@ejemplo.com TuContraseña "Tu Nombre"
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getDb, closeDatabase } from '../src/db.js';

const [email, password, ...resto] = process.argv.slice(2);
const nombre = resto.join(' ').trim() || 'Dueño';

if (!email || !password) {
  console.log('Uso: npm run crear-admin -- correo contraseña "Nombre"');
  process.exit(1);
}
if (password.length < 6) {
  console.log('✖ La contraseña debe tener al menos 6 caracteres.');
  process.exit(1);
}

const db = getDb();
const correo = email.trim().toLowerCase();
const hash = bcrypt.hashSync(password, 10);
const existe = await db.prepare('SELECT id FROM usuarios WHERE email = ?').get(correo);

if (existe) {
  await db.prepare("UPDATE usuarios SET password_hash = ?, rol = 'admin' WHERE id = ?").run(hash, existe.id);
  console.log(`✔ Se actualizó la contraseña de ${correo} y ahora es dueño (admin).`);
} else {
  await db.prepare("INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, 'admin')").run(nombre, correo, hash);
  console.log(`✔ Cuenta de dueño creada: ${correo}`);
}

await closeDatabase();
