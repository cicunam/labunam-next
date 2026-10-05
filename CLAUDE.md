@AGENTS.md

# Guía de trabajo para Claude

Las reglas compartidas se importan de `AGENTS.md`. Este archivo complementa esas
reglas con un mapa para investigar y modificar el proyecto sin depender del
historial de conversaciones. El README contiene los procedimientos completos.

## Punto de partida

1. Confirmar que se trabaja en `labunam-next`, no en el PHP de referencia `labunam2`.
2. Revisar el estado de Git y la solicitud actual antes de asumir que un hito o
   una validación histórica representan el estado de hoy.
3. Localizar la responsabilidad en el mapa de abajo; leer su código, pruebas e
   instrucciones de Next instaladas antes de modificarla.
4. Hacer el cambio y validarlo con el alcance adecuado; informar qué se comprobó
   y qué sigue pendiente. No prometer envíos o despliegues inexistentes.

## Mapa de responsabilidades

| Trabajo | Archivos de entrada |
| --- | --- |
| Portada y noticias | `app/page.tsx`, `app/Inicio.module.css` |
| Catálogo y URL de filtros | `app/laboratorios/page.tsx`, `lib/filtros/filtros.ts` |
| Consultas SQL y caché | `lib/db/db.ts`, `lib/catalogo/catalogo.ts` |
| Filas SQL y modelo público | `lib/tiposBase/tiposBase.ts`, `lib/tipos/tipos.ts`, `lib/normalizeCatalog/normalizeCatalog.ts` |
| Búsqueda y facetas | `lib/buscador/buscador.ts`, `lib/capacidades/capacidades.ts` |
| Sugerencias e iconos de áreas | `lib/sugerencias/sugerencias.ts`, `lib/grupos/grupos.ts` |
| API de filtros | `app/api/filtros/route.ts` |
| Ficha pública y API | `app/laboratorios/[id]/page.tsx`, `app/api/laboratorios/[id]/route.ts`, `lib/ficha/ficha.ts` |
| Modal, historial y contenido de ficha | `components/organisms/LaboratoryDialog/`, `components/organisms/LaboratoryDetails/` |
| Tarjetas y filtros visuales | `components/organisms/LaboratoryCard/`, `components/organisms/FilterDialog/` |
| Solicitud de servicios | `app/contacto/page.tsx`, `components/organisms/Contact/` |
| Carrusel | `components/organisms/Carousel/`, `public/js/carrusel.js` |
| Selección y presentación de imágenes | `lib/selectPhotos/selectPhotos.ts`, `lib/fotos/fotos.ts` |
| Procesamiento de originales | `scripts/fotos.ts` |
| Revisión y aplicación de imágenes web | `scripts/revision-fotos/` |
| Pruebas de interacción | `tests/e2e/`, `playwright.config.ts` |

## Comandos cotidianos

```sh
nvm use
npm ci
npm run dev                 # portal: http://localhost:3000
npm run storybook           # componentes: http://localhost:6006
npm run fotos:revisar       # revisión local: http://127.0.0.1:8767
npm run lint
npm test
npm run typecheck
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
- `public/js/carrusel.js` mejora HTML de servidor y administra montaje/limpieza
  durante navegación Next. Probar entrada/salida de la página y no sólo una carga.
- `manifiesto.json` contiene originales y tiene prioridad por laboratorio sobre
  `manifiesto-web.json`. Dentro de una selección, las fotos preceden a los logos.
- Guardar una revisión de imágenes no equivale a aplicarla. La importación corre
  en segundo plano; el revisor muestra su estado mediante `GET /estado`.
- Los SVG de respaldo están versionados; fotos generadas, cachés de exploración y
  selecciones editoriales no. Un clon limpio no reproduce los datos locales aprobados.
- El backend de contacto, noticias definitivas, aceptación institucional y despliegue
  siguen pendientes. Consultar la lista actual del README antes de planear trabajo.
- La medición de rendimiento del Hito 3 es histórica. `docs/rendimiento-hito-3.json`
  documenta el exceso del presupuesto; no usarla como medición de cambios posteriores.

## Mantenimiento de estas instrucciones

Añadir reglas generales a `AGENTS.md`, operación y decisiones a `README.md`, y
orientación específica de Claude aquí. No guardar secretos, rutas personales
innecesarias ni cifras cambiantes como si fueran requisitos permanentes. Conservar
la importación inicial y el bloque de Next generado en `AGENTS.md`.
