# LabUNAM 2.1

Reconstrucción en Next.js del portal público de laboratorios de la UNAM para la
Coordinación de la Investigación Científica. La referencia visual y funcional es
`../labunam2`, rama `propuesta-raul-2`. Ese repositorio se consulta sin modificarlo.

## Estado: Hito 3 — funcionalidad verificada; presupuesto de peso pendiente

Portada, catálogo, fichas con URL propia y contacto están implementados. El generador
produce fotos para 62 laboratorios activos. Las pruebas y compilaciones pasan;
Lighthouse móvil alcanza 93–96/100 en producción local.

El presupuesto de 120 KB gzip de JS+CSS **no se alcanzó**: quedan 154.6 KB. Una
compilación mínima con la misma versión de Next, sin componentes cliente propios,
ya carga 133.5 KB gzip de JavaScript. Este criterio requiere revisar el presupuesto
o la arquitectura antes de darlo por cumplido; los detalles están al final.

El Hito 4 (servidor de la UNAM y revisión institucional) sigue pendiente.

## Arranque

Requisito: Node 24 LTS, versión exacta en `.nvmrc`; npm y el lockfile son la referencia.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Abrir <http://localhost:3000>. Para producción: `npm run build` y `npm start`.
La portada y el catálogo requieren base; Storybook y las pruebas unitarias no. Raúl configura las
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
  interacción: Cabecera, Buscador, ModalFiltros y Ficha.
- CSS Modules colocados. El único CSS global es `app/globals.css`: tokens, reset,
  tipografía y retícula, menos de 300 líneas. Los valores vienen de `tokens.css` del
  PHP; el alias `--sombra-alta` usa `--sombra` para cumplir la decisión de una sola sombra.
- Sólo español, `lang="es"`, textos directamente en los componentes. Sin traducción parcial.
- Comentarios en español que expliquen motivos, no que repitan el código.
- Historias y pruebas sin datos personales reales.

Inter se sirve desde `public/assets/fonts` con su licencia OFL; la interfaz usa el subconjunto `Inter-latino.woff2`. Es la misma fuente
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

## Páginas y organismos del Hito 2

Portada y catálogo se renderizan en el servidor en cada petición; reutilizan la
caché del catálogo y no consultan la base durante el build. El navegador recibe
las sugerencias y facetas, pero no el catálogo completo de servicios y equipos.
`GET /api/filtros` recalcula las cinco facetas conservando consulta y red; cancela
la petición anterior al cambiar rápidamente una selección. El formulario GET
mantiene enlaces compartibles y funciona también mediante navegación nativa.

`GET /api/laboratorios/[id]` devuelve sólo campos públicos y fotos; responde 400,
404 o 503 según corresponda, sin detalles de conexión. Hay un solo diálogo Ficha
por página. Conserva las promesas de las fichas solicitadas durante el montaje,
evita respuestas tardías y permite reintentar una petición fallida. Escape restaura
el foco y las cuatro pestañas admiten flechas, Inicio y Fin.

El carrusel conserva los estilos de Carlos con desplazamiento nativo y ajuste de
posición, flechas, paginación, arrastre y avance circular cada siete segundos.
`public/js/carrusel.js`, cargado mediante `next/script`, mejora el HTML de servidor
sin añadir otro organismo React cliente. Su observador desmonta eventos y temporizador
al navegar; pausa con foco, puntero, pestaña oculta o movimiento reducido, y ofrece
un botón de pausa. El retorno desde la última noticia usa desplazamiento al inicio.

Las noticias están marcadas como ejemplos pendientes de validación editorial.
¿Qué es LabUNAM?, Misión y Visión reproducen los textos de
[la portada publicada](https://labunam.unam.mx/), consultada el 2 de octubre de 2026.
Las fotos generadas de la copia PHP se reutilizaron localmente en `public/fotos`
para la comparación. Esa carpeta sigue ignorada por Git; el generador del Hito 3
hará reproducible su construcción. Si falta el manifiesto se usan fotos de respaldo.

## Verificación del Hito 2 — 2 de octubre de 2026

- 609 tarjetas reales; `?q=microscopia&tipo=nacionales` devuelve **7**.
- **48 pruebas unitarias** y **24 pruebas Playwright** pasan. Cubren los tres anchos
  (375, 1024 y 1400), teclado, sugerencias, recientes, filtros, opciones desactivadas,
  estado vacío, ficha pedida una vez, recuperación de fallo, carrusel y API pública.
- Portada y catálogo revisados en esos tres anchos, sin desbordamiento horizontal,
  imágenes rotas ni errores JavaScript. Catálogo contrastado con el PHP local:
  misma retícula, imágenes y contenido para la búsqueda de aceptación. El orden
  general usa la comparación alfabética española validada en el Hito 1.
- Ocho historias nuevas revisadas en los tres anchos (24 comprobaciones), incluyendo
  diálogos abiertos y error de ficha. Axe sólo señala el contraste blanco/naranja
  de Buscar y Ver laboratorios, excepción explícita de §3.4 del plan. La regla se
  mantiene activa. Los conteos de portada usan `--color-brand-ink` para texto legible.
- Lint, TypeScript, build de Next y build de Storybook pasan. El build de Next no
  da advertencias; Storybook conserva los avisos de empaquetado descritos en Hito 0.
- Cuatro organismos con `use client`; ninguno supera 150 líneas; CSS global: 145 líneas.

## Fotografías — Hito 3

Con Node 24 y las dependencias instaladas mediante `npm ci`:

```sh
npm run fotos
# O bien, una carpeta explícita; no modifica los originales:
npm run fotos -- --origen=/ruta/a/micrositio/img
# Regenera sólo los IDs indicados y conserva el resto del manifiesto:
npm run fotos -- --origen=/ruta/a/micrositio/img --solo=18,100
```

El comando carga `.env` mediante Node y usa `LABUNAM_FOTOS_ORIGEN` cuando no se pasa
`--origen`. `sharp` es dependencia declarada para los scripts; no se importa en
componentes ni rutas web. Se priorizan Carrusel1/2/3, fondo, infraestructura y
antecedentes; las marcas de tiempo resuelven duplicados del carrusel. Corrige EXIF,
genera WebP calidad 80 a 480/960/1440 sin agrandar y publica el manifiesto con un
renombrado atómico. Cada `srcset` usa el ancho real, también para originales pequeños.
Una corrida completa reconstruye el manifiesto; una parcial conserva los otros IDs.
Los errores de una imagen se cuentan y permiten seguir; el comando devuelve código 2
si alguna falla, o 1 si no puede iniciar/publicar. Cada ejecución regenera su selección.

La copia local produjo **65 carpetas con fotos, 195 fotos, cero fallos**; al cruzarlas
con los **609 IDs activos**, **62 laboratorios** tienen foto real. Las otras tres
carpetas no pertenecen al catálogo activo. Se probaron además una imagen EXIF 6,
un original de 200×100 y una ejecución parcial que conserva los IDs anteriores.

El mismo comando crea versiones WebP responsivas de las tres imágenes de respaldo
en `public/fotos/respaldo`, con índice independiente `respaldo.json`. Si no se han
generado, la interfaz sigue usando los originales. Todo `public/fotos` continúa
ignorado por Git; hay que ejecutar el comando al desplegar.

## Fichas y contacto — Hito 3

`/laboratorios/[id]` incluye título «nombre | LabUNAM» y descripción con entidad y
sede; un ID inválido o ausente devuelve 404. Abrir el modal actualiza la URL mediante
History API; cerrarlo o usar Atrás recupera filtros y posición, y Adelante lo reabre.
Recargar o compartir la dirección abre la página individual. Ambas vistas
usan `DetalleFicha`, que se carga mediante `React.lazy` bajo la frontera cliente
existente de `Ficha`. Así se difieren el código y los estilos del detalle hasta
abrirlo, manteniendo el HTML de la ficha individual renderizado por el servidor.
Contacto reutiliza Campo, Boton y Enlace; explica que el envío está deshabilitado
y dirige al catálogo o a los canales de la CIC. No recoge ni transmite mensajes.
El CTA principal «Solicitar un servicio» abre `/contacto?laboratorio=[id]` con el
laboratorio validado en servidor, sus servicios y campos de nombre, correo,
institución y descripción del proyecto. El sitio web queda como enlace secundario.
El formulario permanece deshabilitado hasta conectar el backend de solicitudes.

## Rendimiento y verificación — 4 de octubre de 2026

- **53 pruebas unitarias** y **42 Playwright** pasan; las de navegador se ejecutaron
  contra `next start` a 375, 1024 y 1400 px. Cubren también metadatos, 404, quitar
  chips, filtro de sede, incorporaciones, contacto y las fichas directa/modal.
- Portada, catálogo, ficha y contacto revisados en los tres anchos: sin errores
  JavaScript, imágenes rotas ni desbordamiento. Axe no señala incidencias en las
  páginas nuevas; persiste sólo la excepción de contraste de marca en Buscar.
- Ocho historias afectadas revisadas en tres anchos: 24 comprobaciones sin fallos
  de accesibilidad, JavaScript o desbordamiento. Storybook inicia y compila.
- `npm run lint`, `npm run typecheck` y `npm run build` pasan; el build de Next no
  da advertencias. Storybook conserva sus avisos de empaquetado ya documentados.
- Bajo las pruebas concurrentes, `next start` emitió avisos `MaxListenersExceededWarning`
  sobre `Gzip`; las respuestas y pruebas terminaron correctamente. No se silenciaron
  esos avisos; conviene repetir la prueba con el proxy y la compresión del servidor
  de desarrollo en el Hito 4.

Lighthouse **12.8.2**, preset móvil con throttling simulado predeterminado, catálogo
completo en producción local (`npm run build` + `npm start -- --port 3002`). Dos
mediciones después de optimizar dieron **93 y 96**; última: **FCP 1.81 s, LCP 2.64 s,
TBT 23 ms, CLS 0**. Son mediciones locales; no sustituyen la comprobación en la UNAM.

Se optimizaron respaldos y logos, se priorizó la primera foto, se difirió el detalle
de ficha y se usa `content-visibility` en tarjetas fuera de pantalla. Inter conserva
sus ejes variables y los caracteres españoles en un subconjunto de 66 KB, frente
a los 344 KB originales. Los originales y la licencia se conservan. Para regenerar
los logos: `node scripts/recursos.ts`; para la fuente: `sh scripts/fuente.sh` con
fonttools 4.66.1 y brotli 1.2.0 disponibles. Estas herramientas de fuente no forman
parte de la aplicación ni son necesarias para compilar los recursos ya guardados.

**Desviación del presupuesto:** JavaScript **144,279 bytes gzip**, CSS **10,306**;
total **154,585 bytes** (154.6 KB decimales / 151.0 KiB), superior a los 120 KB del
plan. Se sumaron los recursos JS/CSS descargados por Lighthouse, recomprimidos con
`gzipSync` sin cabeceras HTTP; no se incluyen imágenes, fuentes ni HTML. Se redujo
la carga inicial difiriendo `DetalleFicha`, pero no se declara satisfecho el límite.

Como control, una aplicación mínima Next **16.3.8**, React **19.2.8**, App Router y
Turbopack, con sólo `html/body` y un `h1` (sin componentes cliente propios ni CSS),
produjo **133,529 bytes gzip de scripts modernos**. El runtime por sí solo supera
el presupuesto. Alcanzar 120 KB requiere revisar esa restricción o la arquitectura;
no se cambiaron las versiones ni las decisiones del plan para ocultar el exceso.
La medición y los archivos contabilizados están en
[docs/rendimiento-hito-3.json](docs/rendimiento-hito-3.json).

Para repetir las pruebas sobre una instancia de producción ya iniciada:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002 npm run test:e2e
npx lighthouse http://127.0.0.1:3002/laboratorios --only-categories=performance --chrome-flags=--headless
```

Los informes completos y capturas de esta sesión quedaron en el scratchpad
`hito-3`; no contienen credenciales y no se incorporan al repositorio.

## Ajuste de navegación y solicitudes — 4 de octubre de 2026

Se elimina «Abrir página de la ficha». El modal mantiene el catálogo montado al
cambiar la URL y conserva su caché de fichas. Se verifican cierre, Escape, Atrás,
Adelante, recarga, filtros, foco, posición y solicitud asociada al laboratorio en
375, 1024 y 1400 px. El informe de rendimiento anterior corresponde al cierre del
Hito 3, antes de este ajuste.

Validación del ajuste: 53 pruebas unitarias y los 48 casos de navegador pasan
(45 en la suite inicial y los casos ampliados de historial/posición comprobados
después). Lint, TypeScript y build de producción pasan. Se revisaron capturas del
modal y la solicitud en móvil y escritorio.

## Revisión local de imágenes web

Ejecutar con Node 24: `npm run fotos:revisar`. Abre
http://127.0.0.1:8767; es una herramienta local, separada del sitio público.
La lista local incluye la exploración de todos los registros sin imágenes,
además de los ya aprobados. El archivo incluido en Git conserva el piloto como
base; la lista ampliada está en `.revision-fotos/candidatas.json`.
Las páginas de origen se conservan. «Pendientes con imágenes» permite revisar
primero los resultados útiles; «Todos» incluye los casos sin sitio o sin candidatas.

Selecciona hasta tres imágenes, indica la principal y pulsa «Guardar y siguiente».
También puedes dejar un registro pendiente o marcarlo sin imagen adecuada.
El avance se guarda en `.revision-fotos/seleccion.json` (ignorado por Git);
puedes exportarlo desde la interfaz. Anterior/Siguiente sólo navegan, no guardan
cambios sin confirmar. Los logos institucionales generales no se proponen como
logos propios de un laboratorio.

«Aplicar aprobadas al catálogo» inicia directamente la importación y descarga únicamente
las imágenes aprobadas. Genera WebP de 480/960/1440 según el tamaño original, con
fondo blanco y sin recorte para logos, y publica `public/fotos/manifiesto-web.json`.
Si alguna imagen falla, conserva la versión anterior de ese laboratorio. Las
fotografías oficiales del manifiesto original tienen prioridad sobre las web.
El generador de fotos originales no elimina este manifiesto adicional. Guardar
una nueva revisión no retira fotos ya aplicadas; volver a aplicar reemplaza sólo
los laboratorios aprobados. El archivo registra fuente y la autorización que
Raúl informó haber recibido del Dr. José Sámano, sin asumir verificación externa.

Para pruebas aisladas admite `--puerto=8768 --estado=/ruta/estado --destino=/ruta/fotos`.
Se comprobó selección, guardado, recarga, importación de foto y logo en una carpeta
temporal, formato WebP, diseño móvil, IDs inválidos y rechazo de escrituras desde
otro origen. Las decisiones de Raúl se conservan al ampliar la lista.


### Búsqueda ampliada

`npm run fotos:buscar` (Node 24 y Python 3) consulta sólo laboratorios activos sin
fotos oficiales ni web aplicadas, revisa sus webs y comprueba las imágenes.
No publica resultados automáticamente. Guarda páginas en caché local y consulta
robots.txt; descarta direcciones privadas, sitios bloqueados, iconos pequeños,
duplicados institucionales y logos generales identificados. Revisa hasta dos
enlaces pertinentes de una página general; no es un rastreo exhaustivo de cada
sitio. Una candidata automática requiere confirmar correspondencia y actualidad.
Algunos servidores, páginas dinámicas y SVG pueden necesitar revisión manual.

Resultado de esta ampliación: 542 registros sin imagen revisados, 128 laboratorios
nuevos con candidatas tras depuración, 5 aprobados conservados, 308 imágenes en la
lista total (27 clasificadas como logos candidatos). Los demás permanecen con una
nota de por qué no se obtuvo imagen. Se conserva el avance en disco y el revisor
lee la lista nueva al recargar o pulsar «Actualizar lista». Aplicar omite las
selecciones que ya coinciden con el manifiesto web. Los datos, cachés y decisiones
locales permanecen ignorados por Git; hay que conservar esa carpeta al trasladar
el trabajo a otro equipo.


La aplicación funciona en segundo plano con `GET /estado`: muestra el número de
laboratorios procesados y el laboratorio actual, conserva el progreso visible al
recargar y publica cada laboratorio completado. El botón se deshabilita mientras
trabaja. Se retiró la confirmación nativa del navegador, que no iniciaba la
operación en el navegador integrado. La última ejecución completó 95 laboratorios
nuevos y conservó los 5 existentes, sin errores.

## Respaldo visual sin fotografía

Las tarjetas, el modal y la ficha individual usan fotografías reales primero,
logos aprobados después y una única ilustración SVG cuando no hay imágenes.
Un laboratorio con una sola área recibe su icono; con varias áreas o ninguna se
usa la ilustración general. En la galería se muestra «Sin fotografía disponible». Los logos y
las ilustraciones se ajustan completos al espacio, sin recorte. Las fotos genéricas
anteriores ya no se usan como respaldo y el generador deja de producirlas.
Los SVG están en `public/assets/respaldos`, con los mismos trazos de los iconos
de áreas. Las fotos tienen prioridad sobre los logos, conservando el orden
editorial dentro de cada tipo.

## Tarjetas del catálogo

Las tarjetas priorizan el nombre completo, la entidad, la sede y hasta dos
servicios o equipos registrados. Cuando hay coincidencias con la búsqueda,
se muestran esas capacidades y un fragmento literal cercano al término buscado.
Sin coincidencias se procura mostrar un servicio y un equipo, si existen.
Los totales quedan al pie y toda la tarjeta abre la ficha.

La foto o el logo ocupa un recuadro de 64 px; cuando falta se utiliza un icono
de área discreto. El catálogo muestra una, dos o tres columnas según el ancho
disponible. La galería de la ficha conserva las imágenes grandes y su respaldo.
Validación del cambio: 61 pruebas unitarias, 51 pruebas de navegación en móvil,
tableta y escritorio, compilación de producción y lint.
