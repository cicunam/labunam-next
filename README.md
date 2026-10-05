# LabUNAM Next

Portal público de laboratorios de la Universidad Nacional Autónoma de México,
desarrollado para la Coordinación de la Investigación Científica (CIC).
Permite encontrar laboratorios por nombre, técnicas, equipos, servicios y áreas,
consultar sus fichas y comenzar una solicitud de servicio.

Repositorio: [cicunam/labunam-next](https://github.com/cicunam/labunam-next).

## Documentación para el equipo

Empieza por la [guía de incorporación](docs/README.md), pensada para quienes
conocen React pero todavía no han trabajado con Next.js:

- [Preparar el entorno](docs/01-primeros-pasos.md).
- [Estructura y funcionamiento](docs/02-arquitectura.md).
- [Crear componentes](docs/03-componentes.md).
- [Consultar la base de datos](docs/04-base-de-datos.md).
- [Crear y ejecutar pruebas](docs/05-pruebas.md).
- [Trabajar con Storybook](docs/06-storybook.md).
- [Imágenes y entrega de cambios](docs/07-imagenes-y-entrega.md).

Las [decisiones técnicas](docs/decisiones-tecnicas.md) describen los criterios de
arquitectura. `AGENTS.md` contiene instrucciones compartidas para asistentes;
`CLAUDE.md` las importa y añade un mapa de archivos.

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
Storybook y las pruebas unitarias no.

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

Esto inicia el servidor en el entorno donde se ejecuta; no publica automáticamente
el sitio en la UNAM.

## Organización

| Ruta | Responsabilidad |
| --- | --- |
| `app/` | Páginas, layouts y endpoints HTTP |
| `components/atoms/` | Piezas básicas de interfaz |
| `components/molecules/` | Combinaciones genéricas de piezas |
| `components/organisms/` | Secciones y comportamiento del portal |
| `lib/` | MySQL, normalización, búsqueda, filtros y fotos |
| `public/` | Recursos estáticos, fuente, iconos e ilustraciones |
| `scripts/` | Generación de imágenes y revisión editorial |
| `tests/e2e/` | Pruebas de navegador |
| `.storybook/` | Configuración de historias y revisión visual |
| `docs/` | Guías y acuerdos técnicos |

Cada componente tiene su carpeta, CSS Module e historia. Cada módulo de `lib/`
agrupa su lógica, pruebas y fixtures. Los CSS Modules de páginas viven junto a
sus rutas; `app/globals.css` contiene tokens, reset, tipografía y retícula.
Los imports apuntan al archivo concreto, sin barriles `index.ts`.

Componentes y funciones se nombran en inglés; entidades y campos del dominio,
textos visibles y URLs se mantienen en español. Los comentarios explican decisiones
en español. La fuente Inter se sirve desde `public/assets/fonts`, con su licencia
OFL, sin depender de una descarga de Google.

## Páginas y funcionamiento

| URL | Contenido |
| --- | --- |
| `/` | Portada, redes, incorporaciones, áreas, noticias e información institucional |
| `/laboratorios` | Catálogo y filtros compartibles por URL |
| `/laboratorios/[id]` | Ficha individual del laboratorio |
| `/contacto` | Presentación del flujo de contacto |
| `/contacto?laboratorio=[id]` | Solicitud asociada a un laboratorio |
| `/api/filtros` | Facetas y conteos para los controles |
| `/api/laboratorios/[id]` | Datos públicos de una ficha |

El catálogo se renderiza en servidor. `loadCatalog()` combina seis consultas de
sólo lectura y reutiliza una caché en memoria. Las peticiones concurrentes comparten
la carga; si una actualización falla, se conserva la última copia válida.
Cada proceso Node tiene su propia caché.

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

## Pruebas y Storybook

```sh
npm run lint
npm test
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm run storybook
npm run build-storybook
```

Storybook se abre en [el puerto 6006](http://localhost:6006). Vitest comprueba reglas,
normalización, caché y acceso a datos mediante mocks. Playwright comprueba el portal
a 375, 1024 y 1400 px, incluyendo filtros, historial, teclado y arrastre.

Para probar una instancia ya iniciada, pasar su URL:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007 npm run test:e2e
```

El addon de accesibilidad permanece activo. Existe una excepción documentada de
contraste blanco/naranja para el botón de marca; no extenderla a otros componentes.
Storybook puede emitir avisos de empaquetado sobre `use client` y tamaño de chunks;
no equivalen por sí solos a un fallo, pero los errores nuevos deben investigarse.

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
Ver [el procedimiento completo](docs/07-imagenes-y-entrega.md).

## Pendientes y límites conocidos

- Conectar el backend de solicitudes, acordar destinatarios y validar el envío.
  El formulario permanece deshabilitado y no transmite mensajes.
- Sustituir las noticias de ejemplo y completar la revisión editorial institucional.
- Continuar la revisión de imágenes de laboratorios sin fotografía o logo adecuado.
- Configurar despliegue, Node/PM2/Apache y persistencia de imágenes. No existe aún
  automatización de despliegue en este repositorio; consultar los
  [acuerdos de servidor](docs/preguntas-servidor.md).
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
con el equipo; un commit o push no equivale a un despliegue.
