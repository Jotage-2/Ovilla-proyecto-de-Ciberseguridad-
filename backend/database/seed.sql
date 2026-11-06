-- =========================================================
--  OVILLA - Datos de ejemplo
--  Usuarios de prueba:
--    Dueño (admin):  admin@ovilla.pe   / admin123
--    Cliente demo:   cliente@ovilla.pe / cliente123
-- =========================================================

INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Dueño de Ovilla', 'admin@ovilla.pe',   '$2b$10$RJMdqnFGhZaLdhOXHcAz0Oah5R5yVBXM/FBcNpLxjmN/oxLnScCJi', 'admin'),
  ('Lucía Ramos',     'cliente@ovilla.pe', '$2b$10$P1PodKUwwm6NY0a886mVk.nv4HuGkT1vX7T3LmYTEoJz35T.JGdq2', 'cliente');

INSERT INTO categorias (nombre, slug, icono) VALUES
  ('Primeros pasos',   'primeros-pasos', '🪡'),
  ('Amigurumis',       'amigurumis',     '🧸'),
  ('Prendas',          'prendas',        '🧥'),
  ('Accesorios',       'accesorios',     '👜'),
  ('Hogar y deco',     'hogar-deco',     '🏡');

INSERT INTO cursos (titulo, descripcion, autor, precio, es_gratis, imagen, nivel, duracion, categoria_id) VALUES
  ('Crochet desde cero',
   'Aprende a sostener el ganchillo, hacer la cadeneta y los puntos básicos. El punto de partida ideal si nunca has tejido.',
   'Rosa Huamán', 0, 1, '/covers/cover-1.svg', 'Principiante', '1 h 20 min', 1),
  ('Lectura de patrones y gráficos',
   'Entiende las abreviaturas, los diagramas de símbolos y cómo seguir cualquier patrón sin perderte.',
   'Rosa Huamán', 0, 1, '/covers/cover-2.svg', 'Principiante', '45 min', 1),
  ('Amigurumi: tu primer osito',
   'Teje un osito de 15 cm paso a paso: anillo mágico, aumentos, disminuciones, relleno y armado.',
   'Mariela Quispe', 59.90, 0, '/covers/cover-3.svg', 'Intermedio', '3 h 10 min', 2),
  ('Amigurumis de animales andinos',
   'Llama, alpaca y cóndor en versión amigurumi. Incluye patrones descargables y técnicas de bordado de rostro.',
   'Mariela Quispe', 79.90, 0, '/covers/cover-4.svg', 'Intermedio', '4 h 30 min', 2),
  ('Cárdigan oversize a crochet',
   'Diseña y teje un cárdigan a tu medida. Aprende a tomar medidas, calcular muestras y unir piezas.',
   'Daniela Paredes', 99.90, 0, '/covers/cover-5.svg', 'Avanzado', '6 h', 3),
  ('Gorros y chalinas para el invierno',
   'Tres proyectos rápidos para regalar: gorro con pompón, chalina acanalada y cuello infinito.',
   'Daniela Paredes', 49.90, 0, '/covers/cover-6.svg', 'Principiante', '2 h 15 min', 3),
  ('Bolsos de trapillo',
   'Teje bolsos resistentes y modernos con trapillo: base ovalada, asas firmes y acabados profesionales.',
   'Carla Mendoza', 69.90, 0, '/covers/cover-7.svg', 'Intermedio', '3 h', 4),
  ('Posavasos y mandalas',
   'Un proyecto gratuito y relajante para practicar tejido en redondo y cambios de color.',
   'Carla Mendoza', 0, 1, '/covers/cover-8.svg', 'Principiante', '50 min', 5),
  ('Mantas granny square',
   'Domina el clásico cuadrado de la abuela y aprende a unirlos para crear mantas y cojines.',
   'Rosa Huamán', 64.90, 0, '/covers/cover-9.svg', 'Intermedio', '3 h 40 min', 5);

INSERT INTO lecciones (curso_id, orden, titulo, contenido, video_url) VALUES
  -- Curso 1: Crochet desde cero (gratis)
  (1, 1, 'Materiales que necesitas', 'Para empezar solo necesitas un ganchillo de 4 a 5 mm, un ovillo de lana de grosor medio en un color claro (para ver bien los puntos), una tijera y una aguja lanera. Evita lanas muy peludas o muy oscuras al principio.', ''),
  (1, 2, 'Nudo inicial y cadeneta', 'Haz un lazo con el hilo, pasa el ganchillo, toma la hebra y sácala por el lazo: ese es tu nudo deslizado. Para la cadeneta, toma hebra y pásala por el punto que tienes en el ganchillo. Repite hasta tener 20 cadenetas parejas.', ''),
  (1, 3, 'Punto bajo', 'Inserta el ganchillo en la segunda cadeneta desde el ganchillo, toma hebra y sácala (tienes 2 lazadas), vuelve a tomar hebra y pásala por las 2 lazadas. Teje una fila completa y gira el trabajo.', ''),
  (1, 4, 'Punto alto y tu primera muestra', 'Toma hebra antes de insertar el ganchillo, saca una lazada (tienes 3), cierra de 2 en 2. Teje 10 filas de punto alto para obtener un cuadrado de práctica.', ''),

  -- Curso 2: Lectura de patrones (gratis)
  (2, 1, 'Abreviaturas más comunes', 'cad = cadeneta, pb = punto bajo, pa = punto alto, pd = punto deslizado, aum = aumento, dism = disminución, AM = anillo mágico. Entre paréntesis se indica el total de puntos de la vuelta.', ''),
  (2, 2, 'Diagramas de símbolos', 'Un óvalo es una cadeneta, una cruz o una "x" es un punto bajo y una "T" con una raya es un punto alto. Los diagramas en redondo se leen desde el centro hacia afuera, en sentido antihorario.', ''),
  (2, 3, 'Repeticiones y asteriscos', 'Lo que va entre asteriscos (*) o corchetes se repite el número de veces indicado. Ejemplo: *2 pb, 1 aum* x6 significa repetir esa secuencia seis veces en la vuelta.', ''),

  -- Curso 3: Osito amigurumi
  (3, 1, 'Materiales y anillo mágico', 'Usa algodón de 2,5 mm con ganchillo de 2 mm para un tejido apretado. Aprende el anillo mágico: enrolla el hilo en tus dedos, teje 6 pb dentro y tira del extremo para cerrar.', ''),
  (3, 2, 'Cabeza: aumentos en espiral', 'V1: 6 pb en AM. V2: 6 aum (12). V3: *1 pb, 1 aum* x6 (18). Continúa hasta 36 puntos, teje 6 vueltas rectas y luego disminuye en el mismo orden.', ''),
  (3, 3, 'Cuerpo, brazos y piernas', 'El cuerpo se teje igual que la cabeza pero llegando a 30 puntos. Brazos y piernas son tubos de 6 a 10 puntos. Rellena firme con fibra sintética antes de cerrar.', ''),
  (3, 4, 'Armado y bordado del rostro', 'Cose las piezas con aguja lanera usando punto invisible. Coloca los ojos de seguridad entre las vueltas 8 y 9 de la cabeza y borda la nariz con hilo negro.', ''),

  -- Curso 4: Animales andinos
  (4, 1, 'La llama: cuerpo y cuello', 'El cuello se teje en continuidad con el cuerpo para evitar costuras débiles. Usa lana tipo bouclé en las orejas para dar textura.', ''),
  (4, 2, 'La alpaca: técnica de rizo', 'El punto rizo crea el efecto lanudo de la alpaca. Se teje por el reverso enrollando la hebra en el dedo antes de cerrar el punto bajo.', ''),
  (4, 3, 'El cóndor: alas con forma', 'Las alas se tejen en filas con aumentos al inicio y disminuciones al final. Introduce un alambre forrado para que mantengan la postura.', ''),

  -- Curso 5: Cárdigan oversize
  (5, 1, 'Medidas y muestra de tensión', 'Teje un cuadrado de 15 x 15 cm con el punto del proyecto. Cuenta cuántos puntos y filas hay en 10 cm: con eso calcularás cada pieza.', ''),
  (5, 2, 'Espalda y delanteros', 'La espalda es un rectángulo del ancho de tu contorno más 10 cm de holgura dividido entre dos. Los delanteros miden la mitad de la espalda cada uno.', ''),
  (5, 3, 'Mangas y unión', 'Las mangas se tejen en forma trapezoidal. Une las piezas con punto deslizado por el revés para una costura plana.', ''),
  (5, 4, 'Bordes y acabados', 'Teje un borde acanalado de punto alto en relieve alrededor de toda la abertura delantera para que el cárdigan no se deforme.', ''),

  -- Curso 6: Gorros y chalinas
  (6, 1, 'Gorro con pompón', 'Se teje en redondo de abajo hacia arriba con elástico en punto alto en relieve. Para el pompón, enrolla lana en un cartón de 7 cm unas 100 veces.', ''),
  (6, 2, 'Chalina acanalada', 'Teje en filas trabajando solo la hebra trasera del punto bajo: así obtienes un acanalado elástico y reversible.', ''),
  (6, 3, 'Cuello infinito', 'Teje una tira larga y une los extremos con media vuelta antes de coser para obtener el efecto infinito.', ''),

  -- Curso 7: Bolsos de trapillo
  (7, 1, 'Cómo elegir trapillo', 'Elige trapillo de grosor uniforme y ganchillo de 8 a 10 mm. Revisa que no tenga costuras gruesas que se noten en el tejido.', ''),
  (7, 2, 'Base ovalada', 'Comienza con una cadeneta de 15 puntos y teje alrededor de ambos lados, haciendo 3 aumentos en cada extremo por vuelta.', ''),
  (7, 3, 'Paredes y asas', 'Sube las paredes sin aumentos. Para las asas, deja 12 cadenetas al aire y sáltate 12 puntos; en la siguiente vuelta teje pb sobre las cadenetas.', ''),

  -- Curso 8: Posavasos y mandalas (gratis)
  (8, 1, 'Mandala de 4 vueltas', 'V1: 12 pa en AM. V2: 2 pa en cada punto (24). V3: *1 pa, 2 pa en el sig* (36). V4: cambia de color y teje 1 pb, 3 cad en cada punto para el borde.', ''),
  (8, 2, 'Cambios de color limpios', 'Cambia de color en el último paso del punto anterior: cierra la última lazada con el color nuevo y teje encima los cabos para no tener que coserlos.', ''),

  -- Curso 9: Granny square
  (9, 1, 'El granny clásico', 'Inicia con 4 cad unidas en anillo. V1: 3 cad, 2 pa, *2 cad, 3 pa* x3, 2 cad. Cada esquina lleva siempre 3 pa, 2 cad, 3 pa.', ''),
  (9, 2, 'Variaciones de color', 'Planifica una paleta de 3 a 5 colores. Alterna el orden por cuadrado para que la manta se vea equilibrada.', ''),
  (9, 3, 'Uniones con punto bajo y zigzag', 'Une los cuadrados por el derecho con pb para una costura decorativa o por el revés con pd para una unión invisible.', '');

-- La cliente demo ya compró un curso para que "Mis cursos" tenga contenido
INSERT INTO compras (usuario_id, curso_id, monto, metodo, referencia) VALUES
  (2, 3, 59.90, 'tarjeta', 'DEMO-0001');
