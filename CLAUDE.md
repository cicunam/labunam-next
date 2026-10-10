@AGENTS.md

# Guía de trabajo para Claude

Las reglas compartidas se importan de `AGENTS.md`. Este archivo complementa esas
reglas con un mapa para investigar y modificar el proyecto sin depender del
historial de conversaciones. El README contiene los procedimientos completos.

## Punto de partida

1. Confirmar que se trabaja en `labunam-next`.
2. Revisar el estado de Git y la solicitud actual antes de asumir que
   una validación anterior representa el estado de hoy.
3. Localizar la responsabilidad en el mapa de abajo; leer su código, pruebas e
   instrucciones de Next instaladas antes de modificarla.
4. Hacer el cambio y validarlo con el alcance adecuado; informar qué se comprobó
   y qué sigue pendiente. No prometer envíos o despliegues inexistentes.

## Mapa de responsabilidades

| Trabajo | Archivos de entrada |
| --- | --- |
| Portada y noticias | `src/app/page.jsx`, `src/lib/home/homeContent.js`, organismos `LaboratoryNetworks`, `RecentLaboratories`, `DisciplineSection` y `NewsSection` |
| Catálogo y URL de filtros | `src/app/laboratorios/page.jsx`, `src/lib/filtros/filtros.js` |
| Consultas SQL y caché | `src/lib/db/db.js`, `src/lib/catalogo/catalogoQueries.js`, `src/lib/catalogo/catalogo.js` |
| Filas SQL y modelo público | `src/lib/normalizeCatalog/normalizeCatalog.js`, `src/lib/catalogo/catalogo.fixtures.js` |
| Búsqueda y facetas | `src/lib/buscador/buscador.js`, `src/lib/capacidades/capacidades.js` |
| Sugerencias e iconos de áreas | `src/lib/sugerencias/sugerencias.js`, `src/lib/grupos/grupos.js` |
| API de filtros | `src/app/api/filtros/route.js` |
| Ficha pública y API | `src/app/laboratorios/[id]/page.jsx`, `src/app/api/laboratorios/[id]/route.js`, `src/lib/ficha/ficha.js` |
| Modal, historial y contenido de ficha | `src/components/organisms/LaboratoryDialog/`, `src/components/organisms/LaboratoryDetails/` |
| Tarjetas y filtros visuales | `src/components/organisms/LaboratoryCard/`, `src/components/organisms/FilterDialog/` |
| Solicitud de servicios | `src/app/contacto/page.jsx`, `src/components/organisms/Contact/` |
| Carrusel | `src/components/organisms/Carousel/`, `public/js/carousel.js` |
| Selección y presentación de imágenes | `src/lib/selectPhotos/selectPhotos.js`, `src/lib/fotos/fotos.js` |
| Procesamiento de originales | `scripts/fotos.js` |
| Revisión y aplicación de imágenes web | `scripts/revision-fotos/` |
| Pruebas de interacción | `tests/e2e/`, `playwright.config.js` |

## Comandos cotidianos

```sh
nvm use
npm ci
npm run dev                 # portal: http://localhost:3000
npm run storybook           # componentes: http://localhost:6006
npm run fotos:revisar       # revisión local: http://127.0.0.1:8767
npm run lint
npm test
npm run build
npm run test:e2e
npm run build-storybook
```

`npm ci` se necesita al preparar el entorno o cambiar el lockfile, no en cada
turno. La portada y el catálogo necesitan MySQL; Storybook y unitarias no.
Si Playwright no tiene Chromium, instalarlo con `npx playwright install chromium`.
Para una instancia de producción en un puerto libre:

```sh
npm run build
npm start -- --hostname 127.0.0.1 --port 3007
# En otra terminal:
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007 npm run test:e2e
```

No iniciar otra instancia sobre un puerto ocupado. Los puertos de este ejemplo
son locales y no definen la configuración del servidor de la UNAM.

## Detalles que suelen causar confusión

- La búsqueda combina palabras normalizadas sobre el catálogo ya cargado; no es
  una consulta SQL nueva por cada chip. Las sugerencias proceden de disciplinas
  y equipos del catálogo. Revisar implementación y fixtures antes de cambiar reglas.
- El catálogo carga seis consultas de sólo lectura y comparte una promesa entre
  peticiones concurrentes. La caché vive por proceso (600 segundos por defecto,
  configurable con `LABUNAM_CATALOGO_SEGUNDOS`), no es persistencia compartida.
- `public/js/carousel.js` mejora HTML de servidor y administra montaje/limpieza
  durante navegación Next. Probar entrada/salida de la página y no sólo una carga.
- `manifiesto.json` contiene originales y tiene prioridad por laboratorio sobre
  `manifiesto-web.json`. Dentro de una selección, las fotos preceden a los logos.
- Guardar una revisión de imágenes no equivale a aplicarla. La importación corre
  en segundo plano; el revisor muestra su estado mediante `GET /estado`.
- Los SVG de respaldo están versionados; fotos generadas, cachés de exploración y
  selecciones editoriales no. Un clon limpio no reproduce los datos locales aprobados.
- El backend de contacto, noticias definitivas, aceptación institucional y despliegue
  siguen pendientes. Consultar la lista actual del README antes de planear trabajo.
- La medición de rendimiento del 4 de octubre de 2026 es histórica. `docs/rendimiento.json`
  documenta el exceso del presupuesto; no usarla como medición de cambios posteriores.

## Mantenimiento de estas instrucciones

Añadir reglas generales a `AGENTS.md`, operación y decisiones a `README.md`, y
orientación específica de Claude aquí. No guardar secretos, rutas personales
innecesarias ni cifras cambiantes como si fueran requisitos permanentes. Conservar
la importación inicial y el bloque de Next generado en `AGENTS.md`.
