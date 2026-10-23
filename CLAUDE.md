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
| Portada y noticias | `src/app/page.jsx`, organismos `LaboratoryNetworks` (textos de redes; sus nombres en `src/lib/redes/redes.js`), `RecentLaboratories`, `DisciplineSection` y `NewsSection` (noticias de ejemplo) |
| Catálogo y URL de filtros | `src/app/laboratorios/page.jsx`, `src/server/laboratorios/laboratoriosService.js` |
| Consultas SQL y caché | `src/server/config/dbconnection.js`, `src/server/laboratorios/LaboratorioDao.js`, `src/server/laboratorios/laboratoriosCatalogo.js` |
| Filas SQL y modelo público | `src/server/laboratorios/LaboratorioDao.js`, `tests/datosPrueba/catalogo.js` |
| Búsqueda y filtros | `src/lib/buscador/buscador.js` (tabla `filtros` con los seis ejes), `src/lib/capacidades/capacidades.js` |
| Sugerencias e iconos de áreas | `src/lib/sugerencias/sugerencias.js`, `src/lib/grupos/grupos.js` |
| API de filtros | `src/app/api/filtros/route.js`, `src/server/laboratorios/laboratoriosController.js`, `src/lib/api/api.js` |
| Ficha pública y API | `src/app/laboratorios/[id]/page.jsx`, `src/app/api/laboratorios/[id]/route.js`, `src/server/laboratorios/laboratoriosService.js`, `src/server/laboratorios/laboratoriosController.js`, `src/lib/api/api.js` |
| Modal, historial y contenido de ficha | `src/components/organisms/LaboratoryDialog/`, `src/components/organisms/LaboratoryDetails/` |
| Tarjetas y filtros visuales | `src/components/organisms/LaboratoryCard/`, `src/components/organisms/FilterDialog/` |
| Solicitud de servicios | `src/app/solicitud/page.jsx`, organismos `ServiceRequest`, `ServiceRequestForm` y sus secciones (`*Fields`), `src/server/solicitudes/`, `src/lib/solicitudes/` y `src/lib/validacionSolicitud/` |
| Contacto rápido | `src/components/organisms/ContactDialog/`, `FloatingContact` y `ContactLink`, `src/lib/contacto/contacto.js` |
| Carrusel | `src/components/organisms/Carousel/` (`useCarousel.js` tiene la interacción) |
| Selección y presentación de imágenes | `src/server/fotos/fotosService.js`, `src/lib/fotos/fotos.js` |
| Procesamiento de originales | `scripts/fotos.js`, `scripts/selectPhotos.js` |
| Revisión y aplicación de imágenes web | `scripts/revision-fotos/` |
| Pruebas de interacción | `tests/e2e/`, `playwright.config.js` |
| Validación de PR | `.github/workflows/ci.yml`, `.github/workflows/pr-conventions.yml`, `.github/pull_request_template.md` |
| Servidor y despliegue | `scripts/deploy.sh`, `scripts/server-setup.sh`, `ecosystem.config.cjs`, `.github/workflows/deploy-dev.yml`, `docs/07-servidor-de-desarrollo.md` |

## Comandos cotidianos

```sh
nvm use
npm ci
npm run dev                 # portal: http://localhost:3000
npm run fotos:revisar       # revisión local: http://127.0.0.1:8767
npm run lint
npm test
npm run build
npm run test:e2e
```

`npm ci` se necesita al preparar el entorno o cambiar el lockfile, no en cada
turno. La portada y el catálogo necesitan MySQL; las unitarias no.
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

- Los seis filtros se definen una sola vez en la tabla `filtros` de `buscador.js`. Los
  parámetros de URL son heredados: `disciplina` filtra por área y `especialidad` por
  cada una de las 38 disciplinas; la red (`tipo`) se elige en el buscador, no en el diálogo.
- La búsqueda combina palabras normalizadas sobre el catálogo ya cargado; no es
  una consulta SQL nueva por cada chip. Las sugerencias proceden de disciplinas
  y equipos del catálogo. Revisar implementación y datos de prueba antes de cambiar reglas.
- El catálogo carga dos consultas de sólo lectura y comparte una promesa entre
  peticiones concurrentes. La caché vive por proceso (600 segundos por defecto,
  configurable con `LABUNAM_CATALOGO_SEGUNDOS`), no es persistencia compartida.
- Equipos, certificaciones y acreditaciones llegan en la consulta de laboratorios con
  `JSON_ARRAYAGG`. No cambiarlo a `GROUP_CONCAT`: su límite de 1024 bytes truncaría
  listas reales. Las listas se usan en el orden en que llegan, sin ordenarlas en JavaScript;
  las distinciones ya no salen de la más reciente a la más antigua.
- `useCarousel` trabaja sobre el HTML que renderiza `Carousel` y libera listeners y
  observadores al desmontar. Probar entrada/salida de la página y no sólo una carga.
- `manifiesto.json` contiene originales y tiene prioridad por laboratorio sobre
  `manifiesto-web.json`. Dentro de una selección, las fotos preceden a los logos.
- Guardar una revisión de imágenes no equivale a aplicarla. La importación corre
  en segundo plano; el revisor muestra su estado mediante `GET /estado`.
- Los SVG de respaldo están versionados; fotos generadas, cachés de exploración y
  selecciones editoriales no. Un clon limpio no reproduce los datos locales aprobados.
- El backend de solicitudes y de contacto, noticias definitivas, aceptación institucional
  y producción siguen pendientes. Consultar la lista actual del README antes de planear trabajo.
- Mezclar en master despliega en el servidor de desarrollo, que es compartido con otros
  sitios de Apache. No modificar sus sitios ni reiniciar Apache sin `apachectl configtest`.
- La medición de rendimiento del 4 de octubre de 2026 es histórica. `docs/rendimiento.json`
  documenta el exceso del presupuesto; no usarla como medición de cambios posteriores.

## Mantenimiento de estas instrucciones

Añadir reglas generales a `AGENTS.md`, operación y decisiones a `README.md`, y
orientación específica de Claude aquí. No guardar secretos, rutas personales
innecesarias ni cifras cambiantes como si fueran requisitos permanentes. Conservar
la importación inicial y el bloque de Next generado en `AGENTS.md`.
