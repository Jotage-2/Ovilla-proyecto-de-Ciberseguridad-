# Ovilla · Plataforma de cursos de crochet

Tienda online de cursos de crochet con catálogo, buscador, categorías, cuentas de usuario,
cursos gratuitos y de pago, proceso de compra, "Mis cursos" y un panel para el dueño.

- **Frontend:** React 19 + Vite + React Router
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL alojado en Supabase

---

## 1. Instalación (solo la primera vez)

### Paso 1 — Instala Node.js
1. Entra a https://nodejs.org y descarga la versión **LTS** (botón verde). Se necesita la versión **22.13 o mayor**.
2. Instálalo con las opciones por defecto (Siguiente, Siguiente…).
3. Para comprobar, abre una terminal y escribe:
   ```
   node -v
   ```
   Debe mostrar algo como `v24.x.x` o `v22.13.0` o mayor.

> **¿Cómo abro una terminal?**
> - **Windows:** abre la carpeta del proyecto en el Explorador, haz clic en la barra de direcciones, escribe `cmd` y presiona Enter.
> - **Mac:** abre la app *Terminal*, escribe `cd ` (con espacio) y arrastra la carpeta del proyecto a la ventana; presiona Enter.

### Paso 2 — Descomprime el proyecto
Descomprime `ovilla.zip` en una carpeta, por ejemplo `Documentos/ovilla`.

### Paso 3 — Instala las dependencias
Con la terminal abierta **dentro de la carpeta `ovilla`**, escribe:
```
npm run instalar
```
Tarda 1–2 minutos. Descarga las librerías del frontend y del backend.

### Paso 4 — Configura PostgreSQL y la clave secreta
Copia `backend/.env.example` a `backend/.env`. En Supabase abre Connect y copia la URI de Session pooler a `DATABASE_URL`; sustituye el marcador de contraseña por la contraseña de la base. Codifica los caracteres especiales de la contraseña para una URL. Cambia `JWT_SECRET` por una frase larga. No subas ni compartas `.env`.

---

## 2. Ejecutar la página

En la terminal, dentro de la carpeta `ovilla`:
```
npm run dev
```
Espera a ver estos dos mensajes:
```
[API] ✔ API de Ovilla funcionando en http://localhost:4000
[WEB]   ➜  Local:   http://localhost:5173/
```
Abre tu navegador en **http://localhost:5173**

Para detenerla presiona `Ctrl + C` en la terminal.

La base de Supabase debe tener cargados `schema.postgres.sql` y los datos de `seed.sql` previamente. El servidor no crea ni reinicia la base automáticamente.

### Usuarios de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Dueño (panel de administración) | admin@ovilla.pe | admin123 |
| Cliente (ya compró un curso) | cliente@ovilla.pe | cliente123 |

> **Importante:** antes de publicar la página, crea tu propia cuenta de dueño (ver sección 5).

### Comandos útiles
| Comando | Para qué sirve |
|---|---|
| `npm run instalar` | Instala todo (solo la primera vez o si borras `node_modules`) |
| `npm run dev` | Inicia la página en modo desarrollo |
| `npm run crear-admin -- correo clave "Nombre"` | Crea tu cuenta de dueño o cambia su contraseña |
| `npm run reiniciar-db` | Deshabilitado para evitar borrar la base remota |
| `npm run build` y luego `npm start` | Versión final optimizada, todo en http://localhost:4000 |

---

## 3. Qué puede hacer cada usuario

**Visitante (sin cuenta)**
- Ver el catálogo, buscar por nombre, filtrar por categoría y por gratis/de pago.
- Ver y estudiar los cursos gratuitos.
- Ver el temario de los cursos de pago (con las lecciones bloqueadas 🔒).

**Cliente registrado**
- Todo lo anterior + comprar cursos de pago (tarjeta, Yape o Plin).
- Página **Mis cursos** con todos los cursos que compró.

**Dueño (admin)**
- **Resumen:** ingresos, ventas, clientes y últimas compras.
- **Cursos:** crear, editar y eliminar cursos; subir la imagen de portada desde tu computadora;
  agregar, ordenar y quitar lecciones (con enlace de YouTube/Vimeo y texto).
- **Clientes:** lista de clientes registrados, buscador, cuántos cursos compró cada uno y cuánto gastó.
- Ve todos los cursos de pago sin comprarlos.

---

## 4. Estructura de carpetas

```
ovilla/
├── package.json              ← Comandos generales (instalar, dev, build…)
├── README.md                 ← Este archivo
├── .gitignore                ← Archivos que no se suben a Git
│
├── backend/                  ← SERVIDOR (API que se conecta a PostgreSQL)
│   ├── package.json          ← Librerías del backend
│   ├── .env.example          ← Plantilla de configuración (puerto, clave secreta)
│   ├── database/
│   │   ├── schema.postgres.sql ← Tablas para PostgreSQL
│   │   ├── schema.sql        ← Esquema anterior de SQLite
│   │   ├── seed.sql          ← Script con datos de ejemplo (cursos, usuarios, lecciones)
│   │   └── ovilla.db         ← Base anterior de SQLite (no se usa con PostgreSQL)
│   ├── public/
│   │   ├── covers/           ← Portadas de los cursos de ejemplo
│   │   └── uploads/          ← Imágenes que subes desde el panel del dueño
│   ├── scripts/
│   │   ├── init-db.js        ← Reinicio deshabilitado para la base remota
│   │   └── crear-admin.js    ← Crea/actualiza la cuenta del dueño (npm run crear-admin)
│   └── src/
│       ├── server.js         ← Arranca el servidor y une todas las rutas
│       ├── db.js             ← Conexión a la base de datos
│       ├── middleware/
│       │   └── auth.js       ← Revisa si hay sesión iniciada y si es el dueño
│       └── routes/
│           ├── auth.js       ← Registro, inicio de sesión, usuario actual
│           ├── cursos.js     ← Catálogo, buscador, categorías, detalle de curso
│           ├── compras.js    ← Comprar un curso y "Mis cursos"
│           └── admin.js      ← Panel del dueño: cursos, imágenes, clientes, resumen
│
└── frontend/                 ← PÁGINA WEB (lo que ve el usuario)
    ├── package.json          ← Librerías del frontend
    ├── vite.config.js        ← Configuración; conecta la web con el backend
    ├── index.html            ← Página base (título, fuentes)
    ├── public/favicon.svg    ← Ícono de la pestaña
    └── src/
        ├── main.jsx          ← Punto de inicio de React
        ├── App.jsx           ← Lista de páginas y sus direcciones (rutas)
        ├── api.js            ← Funciones que llaman al backend + formato de precios/fechas
        ├── styles.css        ← Todo el diseño (colores en la parte de arriba, :root)
        ├── context/
        │   └── AuthContext.jsx   ← Guarda la sesión del usuario
        ├── components/
        │   ├── Navbar.jsx        ← Menú superior con buscador, Entrar y Registrarse
        │   ├── Logo.jsx          ← Logotipo de Ovilla
        │   ├── Footer.jsx        ← Pie de página
        │   ├── CourseCard.jsx    ← Tarjeta de curso (imagen, título, autor, precio, botón)
        │   ├── CourseImage.jsx   ← Imagen con respaldo si no carga
        │   ├── CategorySidebar.jsx ← Categorías al costado + filtro de precio
        │   ├── ProtectedRoute.jsx  ← Bloquea páginas si no hay sesión o no es dueño
        │   └── Loader.jsx        ← Animación de "Cargando…"
        └── pages/
            ├── Home.jsx          ← Página principal con catálogo
            ├── CourseDetail.jsx  ← Detalle del curso y sus lecciones
            ├── Checkout.jsx      ← Proceso de compra
            ├── MyCourses.jsx     ← Mis cursos
            ├── Login.jsx         ← Entrar
            ├── Register.jsx      ← Registrarse
            ├── NotFound.jsx      ← Página 404
            └── admin/
                ├── AdminLayout.jsx     ← Menú lateral del panel
                ├── AdminDashboard.jsx  ← Resumen de ventas
                ├── AdminCourses.jsx    ← Lista de cursos (editar/eliminar)
                ├── AdminCourseForm.jsx ← Crear/editar curso y lecciones
                └── AdminClients.jsx    ← Lista de clientes
```

### Base de datos (tablas)
| Tabla | Guarda |
|---|---|
| `usuarios` | Clientes y dueño (contraseñas cifradas con bcrypt) |
| `categorias` | Categorías de la barra lateral |
| `cursos` | Título, descripción, autor, precio, gratis/pago, imagen, nivel, categoría |
| `lecciones` | Contenido de cada curso (título, texto, video) |
| `compras` | Qué cliente compró qué curso, monto y código de compra |

### Rutas de la API
| Método | Ruta | Quién | Qué hace |
|---|---|---|---|
| POST | `/api/auth/registro` | Todos | Crear cuenta |
| POST | `/api/auth/login` | Todos | Iniciar sesión |
| GET | `/api/auth/yo` | Con sesión | Datos del usuario actual |
| GET | `/api/categorias` | Todos | Categorías con cantidad de cursos |
| GET | `/api/cursos?q=&categoria=&tipo=` | Todos | Catálogo con búsqueda y filtros |
| GET | `/api/cursos/:id` | Todos | Detalle (contenido solo si tiene acceso) |
| POST | `/api/compras` | Cliente | Comprar un curso |
| GET | `/api/compras/mis-cursos` | Cliente | Cursos comprados |
| GET | `/api/admin/resumen` | Dueño | Estadísticas |
| GET/POST | `/api/admin/cursos` | Dueño | Listar / crear cursos |
| GET/PUT/DELETE | `/api/admin/cursos/:id` | Dueño | Ver / editar / eliminar un curso |
| POST | `/api/admin/imagen` | Dueño | Subir imagen de portada |
| GET | `/api/admin/clientes?q=` | Dueño | Clientes y sus compras |

---

## 5. Cosas importantes antes de vender de verdad

1. **Los pagos están en modo demostración.** El formulario de compra valida los datos y
   desbloquea el curso, pero **no cobra dinero**. Para cobrar de verdad hay que conectar una
   pasarela de pagos (en Perú: Mercado Pago, Culqi o Izipay). El lugar a modificar es
   `backend/src/routes/compras.js` (registrar la compra solo cuando la pasarela confirme el pago)
   y `frontend/src/pages/Checkout.jsx` (mostrar el formulario de la pasarela).
   Nunca guardes números de tarjeta en tu base de datos; el sistema actual no los envía al servidor.
2. **Crea tu propia cuenta de dueño.** Con la página detenida, en la terminal dentro de `ovilla`:
   ```
   npm run crear-admin -- tucorreo@ejemplo.com TuContraseñaSegura "Tu Nombre"
   ```
   Si el correo ya existe, le cambia la contraseña y lo convierte en dueño. Úsalo también para
   cambiar la contraseña de `admin@ovilla.pe` (o crea la tuya y deja de usar esa).
3. **Cambia `JWT_SECRET`** en `backend/.env` por una frase larga y secreta.
4. **Publicarla en internet:** necesitas un servicio que ejecute Node.js (Render, Railway,
   un VPS, etc.). Se ejecuta con `npm run instalar`, `npm run build` y `npm start`. Asegúrate de
   que el servicio conserve `backend/public/uploads` y configura `DATABASE_URL` y `JWT_SECRET`.
5. **Copia de seguridad:** utiliza el mecanismo de respaldo de tu base PostgreSQL en Supabase.

---

## 6. Problemas comunes

| Problema | Solución |
|---|---|
| Error de conexión con PostgreSQL | Comprueba `DATABASE_URL`, contraseña, red y configuración SSL de Supabase |
| `'npm' no se reconoce como un comando` | Reinicia la computadora después de instalar Node.js |
| `EADDRINUSE: port 4000` | Ya hay otra copia corriendo. Cierra la otra terminal o reinicia la PC |
| La página muestra "No se pudo conectar con el servidor" | El backend no está encendido; revisa que `npm run dev` siga corriendo |
| Quiero empezar de cero | Gestiona la base en Supabase después de respaldar sus datos |
| Quiero cambiar los colores | Edita las variables al inicio de `frontend/src/styles.css` (por ejemplo `--accent`) |
