# LabUNAM 2.1

Reconstrucción en Next.js del portal público de laboratorios de la UNAM para la
Coordinación de la Investigación Científica. La referencia visual y funcional es
`../labunam2`, rama `propuesta-raul-2`. Ese repositorio se consulta sin modificarlo.

## Estado: Hito 1

Hitos 0 y 1 implementados. La base incluye cabecera y pie reales, menú por teclado,
Inter local y tokens. La capa de datos consulta MySQL mediante un único pool,
normaliza el catálogo, lo guarda en memoria durante 600 segundos y sirve la copia
anterior si falla la base. El buscador combina siete criterios y cuenta las facetas.

Storybook reúne los átomos y moléculas del Hito 1. La portada aún muestra sólo la
identidad institucional: los organismos completos, el buscador y las páginas con
datos se integran en el Hito 2. Las redirecciones ya existen; el catálogo, la ficha
y contacto tendrán su página en los hitos correspondientes.

## Arranque

Requisito: Node 24 LTS, versión exacta en `.nvmrc`; npm y el lockfile son la referencia.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Abrir <http://localhost:3000>. Para producción: `npm run build` y `npm start`.
La portada inicial y las pruebas unitarias funcionan sin base. Raúl configura las
variables tomando `.env.example` como guía. Los agentes no leen, copian ni imprimen
archivos de credenciales.

## Componentes y estilos

- Atomic Design: `components/atoms`, `components/molecules`, `components/organisms`.
  Los átomos y moléculas no conocen el dominio; los organismos sí.
- Archivos planos por nivel, con `Nombre.tsx`, `Nombre.module.css` y
  `Nombre.stories.tsx` juntos. `Boton` es el patrón que puede copiar el equipo.
- Las plantillas son los `layout.tsx` de `app/`; una URL se implementa en `app/`.
  Cálculos y acceso a datos van en `lib/`, sin React, con pruebas colocadas.
- Ningún componente supera 150 líneas. Las props se tipan en la firma de la función.
  Nombres de dominio en español; `props`, `children`, `onClose` conservan el vocabulario React.
- Componentes de servidor por omisión. Sólo se agrega `"use client"` si se necesita
  interacción; en este hito sólo la cabecera lo necesita.
- CSS Modules colocados. El único CSS global es `app/globals.css`: tokens, reset,
  tipografía y retícula, menos de 300 líneas. Los valores vienen de `tokens.css` del
  PHP; el alias `--sombra-alta` usa `--sombra` para cumplir la decisión de una sola sombra.
- Sólo español, `lang="es"`, textos directamente en los componentes. Sin traducción parcial.
- Comentarios en español que expliquen motivos, no que repitan el código.
- Historias y pruebas sin datos personales reales.

Inter se sirve desde `public/assets/fonts` con su licencia OFL. Es la misma fuente
en Next y Storybook, sin pedirla a Google al compilar o visitar la página. El favicon
original está vacío; `app/icon.png` se deriva del logotipo real de LabUNAM.
Los assets estáticos del PHP se conservan; sus fotos generadas se excluyen de la copia y de Git; `ilustracion-inicio.png` no se utiliza.

## Herramientas y decisiones del plan

Next.js estable, App Router, TypeScript, ESLint, alias `@/` a la raíz y sin `src/`.
Se usan rutas por carpetas, componentes de servidor, `searchParams`, Route Handlers,
`redirects()`, `metadata` y `generateStaticParams` sólo cuando haga falta.

Dependencias permitidas: `mysql2`, `sharp` (sólo para el script de fotos), Vitest,
Playwright y Storybook con `@storybook/nextjs-vite` y accesibilidad. Las dependencias
de base de Next/React/TypeScript/ESLint y las transitivas de esas herramientas son
parte del andamiaje. MySQL ya está instalado; el procesado de fotos se añade en el Hito 3.

No usamos Redux, Zustand, Jotai, Tailwind, CSS-in-JS, styled-components, archivos
barril `index.ts`, HOCs, `any` ni configuración personalizada de webpack.
Tampoco middleware, Server Actions, `next/image`, rutas paralelas/interceptadas,
ISR ni APIs `unstable_*` sin una razón escrita aquí. No se añadió ninguna excepción.

Las fotos se servirán con `<img srcset sizes loading="lazy">`. Por esa decisión
explícita se desactiva únicamente `@next/next/no-img-element` en ESLint.
La caché del catálogo es un objeto en memoria durante 600 segundos, con la copia
anterior como respaldo si falla MySQL. Las peticiones concurrentes comparten una
carga; no usa caché propia de Next.

`next.config.ts` devuelve **301** explícitos para `/nacionales`, `/universitarios`,
`/unidades`, `/internacionales` y `/buscar`, conservando los parámetros de búsqueda.
`permanent: true` daría 308 según la [documentación de Next](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects),
por eso se usa `statusCode: 301`.

## Storybook

```sh
npm run storybook
npm run build-storybook
```

Abrir <http://localhost:6006>. `Átomos/Boton` ofrece pequeño, mediano, grande y
estado deshabilitado. Cabecera y Pie también tienen historia. La configuración
importa `globals.css` y sirve los assets reales.

El selector de viewport incluye **375, 1024 y 1400 px**. Desde Storybook 9 esta
[función viene integrada](https://storybook.js.org/docs/essentials/viewport);
no se instala el antiguo addon viewport, que pertenece a versiones anteriores.
El addon a11y queda activo y muestra sus hallazgos. Sólo Boton marca sus comprobaciones
como pendientes: el naranja de marca con texto blanco tiene contraste insuficiente
para AA, excepción de imagen explícita del plan. No se oculta la regla de contraste.

## Pruebas

```sh
npm run lint
npm test
npm run test:watch
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Vitest cubre acentos, claves URL, siglas, puntuación, palabras menores, cifras,
paréntesis, texto vacío, espacios, escritura manual y el umbral del 85 % de mayúsculas.
La implementación conserva las reglas del PHP `Texto.php`.

Playwright verifica la portada, el pie, el menú por teclado, cierre con Escape,
retorno de foco, ausencia de desbordamiento horizontal y los cinco 301 con query
strings a los tres anchos. Arranca Next automáticamente si no está en el puerto 3000.
Los casos de catálogo y contacto se incorporarán en sus hitos.

## Fotos (Hito 3)

El script `scripts/fotos.ts` y el comando `npm run fotos` se implementan en el Hito 3;
aún no existen. Raúl establecerá `LABUNAM_FOTOS_ORIGEN` con la carpeta real de
micrositios. El script usará `sharp`, hasta tres fotos por laboratorio, orientación
EXIF, WebP calidad 80 en 480/960/1440 px sin agrandar y
`public/fotos/manifiesto.json`. Toda `public/fotos/` queda fuera de Git. Los respaldos
son `laboratorio-abc.jpeg`, `mision.png` y `vision.png`.

## Presupuesto y servidor

El catálogo debe pesar **≤ 120 KB gzip de JavaScript + CSS**. La medición con
Lighthouse y su resultado se anotarán aquí en el Hito 3; todavía no hay catálogo
para medir. Objetivo Lighthouse móvil: rendimiento ≥ 90.

Las [preguntas para quien administra el servidor](docs/preguntas-servidor.md)
registran las respuestas disponibles. Raúl se encarga de la configuración del
servidor y autoriza continuar el desarrollo. Node debe mantenerse vivo y Apache
hacer proxy inverso. Si no es viable, Raúl debe decidir el cambio a exportación estática antes de
construir las páginas.

## Forma de trabajo

Leer el [plan completo](docs/plan-labunam2.1-nextjs.md). Al cerrar cada hito: revisar
el navegador a 375/1024/1400 px, pasar lint y pruebas, arrancar Storybook y hacer un
commit corto, en minúsculas y español, sin trailers. Avisar a Raúl; no hacer push
sin que lo pida. Temporales en el scratchpad de la sesión, nunca en `/tmp`.

## Verificación del Hito 0 — 2 de octubre de 2026

- `npm run lint`, `npm test` (16 casos), `npm run typecheck` y `npm run build`: pasan.
- `npm run test:e2e`: 6 casos pasan, repartidos entre 375, 1024 y 1400 px.
- Portada y menú revisados en Chromium en esos tres anchos: logos y fuente cargan,
  sin desbordamiento horizontal ni errores de JavaScript.
- Storybook arranca; Boton pequeño, mediano y grande revisados en cada ancho.
  `npm run build-storybook` termina correctamente. Su empaquetador avisa sobre
  directivas `use client` y chunks grandes del entorno de Storybook; no son errores
  de ejecución ni advertencias de la compilación de Next.
- Preguntas del servidor entregadas en `docs/preguntas-servidor.md`; respuestas pendientes.

## Capa de datos del Hito 1

`lib/db.ts` crea un solo pool al consultar por primera vez. `lib/catalogo.ts` hace
seis consultas de sólo lectura; `normalizarCatalogo.ts` transforma sus filas en el
tipo público `Laboratorio`. Las filas de MySQL se tipan aparte en `tiposBase.ts`.
La interfaz no recibe campos de personas ni detalles de errores de conexión.

`cargarCatalogo()` entrega `{ laboratorios, sedes, disciplinas, sugerencias }`.
Sedes y especialidades son listas de `{ clave, etiqueta, total }`, sin claves
repetidas y ordenadas por conteo. Las sugerencias incluyen las 38 disciplinas y
hasta 60 equipos presentes en tres o más laboratorios. `grupos.ts` conserva la
asignación de las 38 disciplinas a las diez áreas.

`filtrar()` normaliza la consulta, combina todas sus palabras y prioriza nombre o
siglas, luego capacidades coincidentes y nombre. Los criterios inexistentes se
ignoran; los criterios válidos incompatibles sí devuelven cero. `contarEje()`
conserva los demás criterios y cuenta cada pertenencia una sola vez.

Aclaración del criterio del plan: la suma de facetas no siempre es mayor o igual
que el total. Un laboratorio puede no tener reconocimiento, perfil o disciplina.
Las pruebas comparan la suma contra las pertenencias reales; tipo y sede
(incluyendo la sede vacía) sí suman exactamente el total.

Las moléculas reciben texto, opciones, imágenes y callbacks; no importan el
catálogo ni tipos de laboratorio. La selección y navegación por teclado de un
grupo de pestañas pertenecen al organismo que las reúna; la historia de `Pestana`
lo demuestra con flechas, Inicio y Fin. `OpcionFiltro` conserva habilitada una
opción elegida aunque su conteo sea cero.

## Verificación del Hito 1 — 2 de octubre de 2026

- Base real: **609 laboratorios en 172–177 ms**, 43 nacionales, 111 universitarios,
  452 unidades y 3 internacionales. «microscopia»: **38 resultados**, **7 nacionales**.
- 14 sedes, 38 disciplinas, 92 sugerencias; claves de sede y especialidad únicas.
  Conteo de los seis ejes: 2.3–3.9 ms en esta máquina.
- La comprobación usó una ruta local temporal ejecutada por Next, con salida
  limitada a cifras y tiempos. La ruta se retiró al terminar; los scripts y
  resultados se conservaron en el scratchpad de la sesión.
- 42 pruebas unitarias: texto, normalización, búsqueda, facetas, pool y caché,
  incluyendo concurrencia, caducidad y respaldo cuando falla la base.
- 27 historias nuevas revisadas a **375, 1024 y 1400 px**: 81 comprobaciones sin
  errores de JavaScript, desbordamientos ni infracciones WCAG A/AA detectadas por
  axe. Se comprobaron además selección de radios y teclado en pestañas.
- Lint, TypeScript, build de Next, build de Storybook y las 6 pruebas de navegador
  de los cimientos pasan. Siguen los avisos de empaquetado de Storybook ya
  documentados para el Hito 0.
