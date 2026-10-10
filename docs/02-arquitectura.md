# Cómo está dividido y cómo funciona

[Volver al índice](README.md)

## Las piezas básicas

**React** permite escribir componentes: funciones que reciben datos y devuelven
interfaz. **Next.js** organiza esas interfaces en páginas, ejecuta código de servidor
y expone endpoints HTTP. Usamos **JavaScript**: `.jsx` contiene componentes con etiquetas de interfaz
(JSX), y `.js` contiene funciones, configuración y pruebas sin JSX.

**Node** ejecuta el servidor Next y las herramientas. No corre dentro del navegador.
MySQL sigue siendo la fuente de datos; el portal lo consulta en modo de sólo lectura.

| Carpeta | Responsabilidad | Ejemplo |
| --- | --- | --- |
| `src/app/` | Páginas, layout y endpoints | `src/app/laboratorios/page.jsx` |
| `src/components/atoms/` | Elementos básicos | `Button`, `Input`, `Icon` |
| `src/components/molecules/` | Combinaciones genéricas | `SearchField`, `Gallery` |
| `src/components/organisms/` | Secciones y comportamiento del portal | `LaboratoryDialog`, `SearchBar` |
| `src/lib/` | Datos y funciones sin React | `catalogo`, `buscador`, `fotos` |
| `public/` | Archivos servidos por URL | `public/assets/…` se usa como `/assets/…` |
| `scripts/` | Herramientas que se ejecutan por comando | Generación y revisión de fotos |
| `tests/e2e/` | Pruebas en navegador | Catálogo, fichas, carrusel |
| `.storybook/` | Configuración del explorador de componentes | Historias, estilos y viewports |
| `docs/` | Guías y acuerdos | Este documento |

`@/` en un import apunta a `src/`, por ejemplo
`@/lib/catalogo/catalogo`. La configuración, `public/`, `scripts/` y las pruebas de navegador permanecen en
la raíz. Las páginas y layouts usan `@/components`, que apunta al único barril
`src/components/index.js`. Este archivo reúne los componentes mediante reexports
nombrados. Entre componentes y en historias se usan rutas directas para evitar ciclos.
El barril no lleva `"use client"`; la frontera permanece en cada componente interactivo.

## Una carpeta define una URL

| Archivo | Resultado |
| --- | --- |
| `src/app/page.jsx` | `/` |
| `src/app/laboratorios/page.jsx` | `/laboratorios` |
| `src/app/laboratorios/[id]/page.jsx` | `/laboratorios/70`, con `id = "70"` |
| `src/app/contacto/page.jsx` | `/contacto` |
| `src/app/api/laboratorios/[id]/route.js` | Endpoint que devuelve JSON |
| `src/app/layout.jsx` | Envoltura común: estructura HTML, cabecera y pie |

Los CSS Modules de una página viven junto a su `page.jsx`: por ejemplo,
`src/app/laboratorios/Laboratorios.module.css` y
`src/app/laboratorios/[id]/Laboratorio.module.css`. Las secciones de portada tienen sus CSS Modules junto a cada organismo;
`globals.css` contiene los estilos compartidos.

`page.jsx` exporta por defecto un componente. `route.js` exporta funciones HTTP
como `GET`. Una carpeta cualquiera no se convierte en página sin su archivo
especial. Usa `Link` de Next para enlaces internos.

En esta versión, `params` y `searchParams` de las páginas se consumen de forma
asíncrona. Copia el patrón de las páginas actuales (`await params`,
`await searchParams`) en vez de ejemplos de versiones antiguas.

## Servidor y navegador

Por defecto, las páginas son **Server Components**: pueden esperar datos de MySQL
y generar HTML sin mandar esa lógica SQL al navegador.

Un archivo con `"use client"` establece una frontera para componentes interactivos:
puede usar estado (`useState`), eventos y efectos. Sus imports forman parte de esa
rama cliente; no importar allí el pool, el catálogo del servidor ni secretos.
Los Client Components también pueden participar en el HTML inicial: no significa
que todo su código sólo se ejecute después de abrir el navegador. Acceder a
`window` durante el render puede fallar; úsalo en un evento o efecto apropiado.

Las **props** son los argumentos de un componente. Al pasarlas de servidor a cliente,
usa datos serializables: cadenas, números y objetos públicos sencillos. Una función
normal del servidor no se puede pasar como callback de clic a esa frontera.

## Qué ocurre al abrir el catálogo

```mermaid
flowchart TD
  A[GET /laboratorios?q=microscopia] --> B[Página de servidor]
  B --> C[loadCatalog]
  C --> D{Caché vigente}
  D -->|Sí| E[Catálogo normalizado]
  D -->|No| F[Seis consultas SELECT a MySQL]
  F --> E
  E --> G[Búsqueda y facetas en lib]
  G --> H[HTML de tarjetas y datos públicos para controles]
  H --> I[Navegador: filtros y modal]
  I --> J[API de filtros o ficha cuando se necesita]
```

La caché dura 600 segundos por defecto y conserva la copia anterior si falla una
recarga. Vive en memoria de cada proceso, no en una base aparte. El navegador no
recibe todo el catálogo de servicios y equipos para hacer las búsquedas.

El modal usa History API para cambiar la URL sin desmontar el catálogo. Atrás,
Adelante y cerrar conservan contexto. Si compartes o recargas esa URL, Next sirve
la ficha individual. Ambas vistas reutilizan `LaboratoryDetails`.

## Cómo decidir dónde editar

Orden de portada: `src/app/page.jsx`. Textos de redes y noticias de ejemplo: `src/lib/home/homeContent.js`. Estilo de una tarjeta: su CSS Module.
Regla de búsqueda: `src/lib/buscador/`. Consulta SQL: `src/lib/catalogo/`.
Interacción del carrusel: `public/js/carousel.js` y su organismo; es una mejora
sobre HTML de servidor y no exige convertir toda la portada a cliente.

Antes de añadir una dependencia o cambiar la estrategia de renderizado, consulta
las decisiones del README. La documentación de la versión instalada está en
`node_modules/next/dist/docs/` después de `npm ci`.
