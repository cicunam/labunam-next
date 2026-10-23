# LabUNAM Next

Portal público de laboratorios de la Universidad Nacional Autónoma de México,
desarrollado para la Coordinación de la Investigación Científica (CIC).
Permite encontrar laboratorios por nombre, técnicas, equipos, servicios y áreas,
consultar sus fichas y comenzar una solicitud de servicio.

Usamos Next.js con App Router y JavaScript: componentes en `.jsx` y lógica en
`.js`. El código del portal vive en `src/`; el alias `@/` apunta a esa carpeta.

Repositorio: [cicunam/labunam-next](https://github.com/cicunam/labunam-next).

## Documentación para el equipo

Empieza por la [guía de incorporación](docs/README.md), pensada para quienes
conocen React pero todavía no han trabajado con Next.js:

- [Preparar el entorno](docs/01-primeros-pasos.md).
- [Estructura y funcionamiento](docs/02-arquitectura.md).
- [Crear componentes](docs/03-componentes.md).
- [Consultar la base de datos](docs/04-base-de-datos.md).
- [Crear y ejecutar pruebas](docs/05-pruebas.md).
- [Imágenes y entrega de cambios](docs/06-imagenes-y-entrega.md).
- [Servidor de desarrollo y despliegue](docs/07-servidor-de-desarrollo.md).

La [guía de arquitectura](docs/02-arquitectura.md) explica cómo está dividido el
portal. Las decisiones técnicas y las instrucciones compartidas para asistentes
están en `AGENTS.md`; `CLAUDE.md` las importa y añade un mapa de archivos.

## Requisitos y arranque

Node 24 LTS (versión exacta en `.nvmrc`), npm y acceso de lectura a MySQL.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Abrir [el portal de desarrollo](http://localhost:3000). Configurar `.env` siguiendo
`.env.example` y obtener el acceso a través del responsable del proyecto. Nunca
incorporar credenciales al repositorio. La portada y el catálogo requieren MySQL;
las pruebas unitarias no.

| Variable | Uso |
| --- | --- |
| `LABUNAM_DB_HOST` | Servidor MySQL |
| `LABUNAM_DB_NAME` | Base de datos |
| `LABUNAM_DB_USER` / `LABUNAM_DB_PASS` | Credenciales de sólo lectura |
| `LABUNAM_CATALOGO_SEGUNDOS` | Duración de la caché, 600 segundos por defecto |
| `LABUNAM_FOTOS_ORIGEN` | Directorio de imágenes originales de micrositios |

Para ejecutar una compilación de producción:

```sh
npm run build
npm start
```

Esto inicia el servidor en el entorno donde se ejecuta. El servidor de desarrollo
se actualiza solo con cada mezcla en master; ver [el procedimiento](docs/07-servidor-de-desarrollo.md).

## Organización

| Ruta | Responsabilidad |
| --- | --- |
| `src/app/` | Páginas, layouts y endpoints HTTP |
| `src/components/atoms/` | Piezas básicas de interfaz |
| `src/components/molecules/` | Combinaciones genéricas de piezas |
| `src/components/organisms/` | Secciones y comportamiento del portal |
| `src/server/` | Una carpeta por entidad (DAO, servicio, controlador) y `config/` con la conexión |
| `src/lib/` | Funciones y constantes compartidas |
| `public/` | Recursos estáticos, fuente, iconos e ilustraciones |
| `scripts/` | Generación de imágenes y revisión editorial |
| `tests/e2e/` | Pruebas de navegador |
| `tests/datosPrueba/` | Datos ficticios para pruebas unitarias (`@datosPrueba/`) |
| `docs/` | Guías y acuerdos técnicos |

Cada componente tiene su carpeta y su CSS Module. Los módulos de `src/lib/` y `src/server/`
agrupan su lógica y pruebas. Los CSS Modules de páginas viven junto a
sus rutas; `src/app/globals.css` contiene tokens, reset, tipografía y retícula.
Las páginas y layouts importan componentes desde un único barril `src/components/index.js`:
`import { Header, Footer } from "@/components"`. Entre componentes
se mantienen imports directos para evitar ciclos. Los módulos de `src/lib/` también se importan directamente.

Componentes, funciones, props, variables, variantes, clases CSS y tokens se nombran en inglés; entidades y campos del catálogo,
textos visibles y URLs se mantienen en español. Los comentarios explican decisiones
en español. La fuente Inter se sirve desde `public/assets/fonts`, con su licencia
OFL, sin depender de una descarga de Google.

El backend sigue el recorrido **Controller → Service → DAO → MySQL**. Las páginas
renderizadas en servidor llaman al servicio directamente. Los DAO contienen SQL;
`toLaboratorio` en el DAO convierte filas y los servicios preparan datos públicos. La caché del
catálogo está separada. La conexión vive en `src/server/config/dbconnection.js`.
La [guía de datos](docs/04-base-de-datos.md) incluye ejemplos y el recorrido completo.

## Páginas y funcionamiento

| URL | Contenido |
| --- | --- |
| `/` | Portada, redes, incorporaciones, áreas, noticias e información institucional |
| `/laboratorios` | Catálogo y filtros compartibles por URL |
| `/laboratorios/[id]` | Ficha individual del laboratorio |
| `/contacto` | Redirección 301 a `/solicitud`; conserva `?laboratorio` |
| `/solicitud` | Formulario de solicitud de servicio con catálogos reales; todavía no envía datos |
| `/solicitud?laboratorio=[id]` | Solicitud con «Laboratorio de interés» ya elegido; se puede cambiar |
| `/api/filtros` | Facetas y conteos para los controles |
| `/api/laboratorios/[id]` | Datos públicos de una ficha |
| `/api/laboratorios/sugerencias?q=` | Hasta 15 laboratorios (id, nombre y entidad) para «Laboratorio de interés», con la misma búsqueda que el catálogo |
| `/api/solicitudes/instituciones?q=` | Hasta 15 instituciones vigentes que coinciden con el texto |

La portada incluye un mapa por estado (`LaboratoryMap`) entre las disciplinas y
las noticias. Recibe sólo los conteos de `catalogo.sedes`; seleccionar
un estado abre el catálogo con `?sede=...`. Los trazados SVG se sirven localmente
desde `public/assets/maps/`, con origen y licencia en su archivo `CREDITOS.md`.
No se consulta un servicio externo de mapas ni se muestran ubicaciones exactas.

El catálogo se renderiza en servidor. `loadCatalog()` combina dos consultas de
sólo lectura (laboratorios con sus relaciones y disciplinas) y reutiliza una caché en memoria. Las peticiones concurrentes comparten
la carga; si una actualización falla, se conserva la última copia válida.
Cada proceso Node tiene su propia caché.

El formulario de `/solicitud` usa `loadRequestCatalogs()`
(`src/server/solicitudes/`), con la misma política de caché, para siete catálogos
de sólo lectura. Países, estados de México y EUA,
dependencias vigentes, cargos y tipos de muestra y colaboración viajan con la
página; las instituciones vigentes (miles) se quedan en el servidor y se buscan
desde `/api/solicitudes/instituciones`.

Los textos del formulario se validan con `textError()` (`src/lib/solicitudes/`) tanto en
el navegador como en `validateRequest()`: misma normalización, longitud en caracteres,
formato de correo y rechazo de enlaces o HTML. Así el servidor no devuelve errores que el
formulario no haya advertido.

La búsqueda normaliza acentos y combina palabras para buscar en nombres y
capacidades. Las sugerencias proceden de disciplinas y equipos. El navegador no
recibe el catálogo completo de servicios y equipos para filtrar.

Abrir una ficha en el modal cambia la URL y conserva el catálogo montado. Cerrar,
Escape, Atrás y Adelante recuperan contexto; compartir o recargar la dirección
abre la ficha individual. Los endpoints seleccionan campos públicos y no exponen
mensajes internos de conexión.

La barra de áreas admite arrastre con cursor, gesto táctil y flechas. En móvil
ocupa una fila completa y el botón Filtros queda debajo, a todo el ancho.
Las sugerencias aparecen debajo del campo «Qué buscas».

El carrusel permite arrastre e infinito, avanza cada siete segundos y muestra el
progreso en amarillo. Se pausa durante interacción, fuera del área visible o con
la pestaña oculta, y desactiva el avance automático con movimiento reducido.

Las rutas heredadas `/nacionales`, `/universitarios`, `/unidades`,
`/internacionales` y `/buscar` tienen redirecciones 301 que conservan la búsqueda.
`/contacto` también redirige con 301 a `/solicitud`: el contacto rápido es ahora el
diálogo `ContactDialog`, que se abre desde el sobre flotante de todas las páginas
salvo `/solicitud` (ahí tapaba el formulario en móvil) y desde la columna de orientación
de la solicitud. Su formulario sigue deshabilitado hasta acordar un buzón.

## Pruebas

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Vitest comprueba reglas,
normalización, caché y acceso a datos mediante mocks. Playwright comprueba el portal
a 375, 1024 y 1400 px, incluyendo filtros, historial, teclado y arrastre.

Para probar una instancia ya iniciada, pasar su URL:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007 npm run test:e2e
```

Existe una excepción documentada de contraste blanco/naranja para el botón de marca;
no extenderla a otros componentes.

## Imágenes

```sh
npm run fotos
npm run fotos -- --origen=/ruta/a/micrositio/img --solo=18,100
npm run fotos:buscar
npm run fotos:revisar
```

El generador procesa hasta tres originales por laboratorio, corrige orientación y
produce WebP a 480/960/1440 px sin agrandar. Una corrida completa reconstruye el
manifiesto original; `--solo` conserva los otros IDs. La búsqueda web requiere
Python 3 además de Node y propone candidatas para revisión, sin publicarlas.

El [revisor de imágenes](http://127.0.0.1:8767) permite guardar selecciones y luego
«Aplicar aprobadas al catálogo». La importación muestra progreso y conserva las
imágenes anteriores de un laboratorio si falla su actualización. Es una herramienta
de uso interno, separada del portal público.

`public/fotos/manifiesto.json` tiene prioridad por laboratorio sobre
`manifiesto-web.json`. Se muestran fotografías antes que logos aprobados; sin
imágenes se usan ilustraciones SVG por área única o una general. Los logos se
muestran completos, sin recorte.

`public/fotos/` y `.revision-fotos/` están ignoradas por Git. Conservar y transferir
estos datos mediante el procedimiento del equipo: contienen imágenes aplicadas y
decisiones editoriales que no se recuperan al clonar. Los SVG sí están versionados.
Ver [el procedimiento completo](docs/06-imagenes-y-entrega.md).

## Pendientes y límites conocidos

- Conectar el backend de solicitudes, acordar destinatarios y validar el envío.
  El formulario permanece deshabilitado y no transmite mensajes.
- Obtener la revisión institucional del texto breve de privacidad del formulario de
  solicitud (`PrivacyNotice`), que remite al aviso integral de la CIC.
- Sustituir las noticias de ejemplo y completar la revisión editorial institucional.
- Continuar la revisión de imágenes de laboratorios sin fotografía o logo adecuado.
- Llevar las fotografías al servidor de desarrollo cuando se decida dónde se almacenan.
  Hoy muestra las ilustraciones de respaldo.
- Configurar el servidor de producción, el dominio y HTTPS. Desarrollo se ve sólo por IP.
- Resolver el presupuesto de 120 KB gzip de JS+CSS y repetir las mediciones en el
  servidor de destino. La medición del 4 de octubre de 2026 fue de 154,585 bytes;
  Lighthouse móvil dio 96, con LCP 2.64 s, TBT 23 ms y CLS 0. Es una medición de
  desarrollo con build de producción, no una garantía del sitio desplegado ni de
  cambios posteriores. Método y recursos en [el informe](docs/rendimiento.json).
- Bajo pruebas concurrentes se observaron avisos `MaxListenersExceededWarning` de
  `Gzip`. Verificar el comportamiento con el proxy y la compresión del servidor.

## Entrega de cambios

Revisar las convenciones, ejecutar las comprobaciones adecuadas al cambio y
actualizar la documentación si cambia un procedimiento. Los commits son breves,
en español y sin trailers de atribución. Coordinar ramas, revisión y publicación
con el equipo. Un commit o push a una rama no despliega nada; mezclar en master
despliega en el [servidor de desarrollo](docs/07-servidor-de-desarrollo.md).

Los tickets viven en Plane, en el proyecto LabUNAM con clave `LABUN`. Cada rama y
cada PR se relacionan con su ticket por convención, porque la integración de Plane con
GitHub no está contratada:

| Elemento | Formato | Ejemplo |
| --- | --- | --- |
| Rama | `LABUN-<número>-<descripción-corta>` | `LABUN-38-servidor-desarrollo` |
| Título del PR | `[LABUN-<número>] <qué hace>` | `[LABUN-38] Configura servidor de desarrollo` |
| Descripción del PR | Plantilla de `.github/pull_request_template.md` | Ticket con enlace, cambios, pruebas y pendientes |

Dos flujos de GitHub Actions revisan cada PR:

| Flujo | Qué comprueba | Falla si |
| --- | --- | --- |
| `pr-conventions.yml` | Rama, título y descripción | No siguen el formato, apuntan a tickets distintos o la descripción no menciona el ticket |
| `ci.yml` | `npm ci`, `npm run lint`, `npm run format:check`, `npm test` y `npm run build` con Node de `.nvmrc` | Falla cualquiera de esos comandos |

`ci.yml` también corre en cada commit de master. No usa MySQL ni secretos: las
unitarias simulan la base y las páginas con datos son dinámicas, así que el build no
las consulta. Un commit nuevo en el PR cancela la corrida anterior. Las pruebas de
navegador (`npm run test:e2e`) no corren en GitHub porque dependen de los datos reales
del catálogo; se ejecutan en local cuando cambia la interacción. Los estados del
ticket se actualizan a mano en Plane.

## Legibilidad del código

Los componentes, páginas y layouts se declaran como arrow functions con nombre y
se exportan al final con `export default Nombre;`. El barril los reexporta con nombre
para importarlos con llaves desde `@/components`. Los imports directos entre componentes
usan el default sin llaves. Hooks y utilidades usan exportaciones nombradas.

Ejecutar `npm run format` antes de entregar cambios y `npm run format:check` para
comprobar el estilo. Prettier organiza JavaScript, JSX y CSS; ESLint exige llaves
incluso en condiciones de una sola instrucción.

La portada compone organismos de redes, recientes, disciplinas y noticias. Sus
textos viven en el organismo que los muestra: las redes en `LaboratoryNetworks` y
las noticias de ejemplo en `NewsSection`. Los hooks específicos viven
junto al componente y dejan el JSX como vista: `useSearchSuggestions` en SearchBar
(historial y atajo `/`; la lista y el teclado vienen de `useAutocomplete` en la molécula
`Autocomplete`, que también usa `SuggestionField` en los campos de la solicitud),
`useHeaderMenu` / `useCompactSearch` en Header, `useLaboratoryDialog` en LaboratoryDialog
(apertura, carga e historial del modal y el contrato `data-details`), `useFilterDraft` en
FilterDialog (borrador de filtros con conteos en vivo), `useDragScroll` en DisciplineBar
(arrastre y flechas de la franja) y `useCarousel` en Carousel (arrastre, avance automático
y pausas de las noticias). Las consultas SQL están en los DAO de `src/server/`.
En `src/server/laboratorios/`, `laboratoriosCatalogo.js` carga y guarda en caché todos los
laboratorios y `laboratoriosService.js` responde la ficha, la búsqueda, los filtros y la portada.

Los comentarios explican decisiones y comportamientos que deben conservarse:
historial del modal, peticiones concurrentes, conteos de filtros, datos heredados
y pausas del carrusel. La prioridad es poder seguir el flujo del código sin
comprimirlo para cumplir un número de líneas.

ESLint verifica esta convención con `npm run lint`: componentes arrow y
`export default Nombre;` como última instrucción. Los hooks, las utilidades
y los endpoints quedan fuera de esta regla de componentes.
Los exports propios de Next, como `metadata` y `generateMetadata`, pueden aparecer
antes del export por defecto. Prettier se encarga del formato; ESLint valida la estructura.
