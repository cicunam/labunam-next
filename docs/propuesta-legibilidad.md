# Propuesta de legibilidad para un equipo que viene de csgca

Este documento compara las convenciones de `csgca` (Vite + React + react-router +
react-query + `@cicunam/sd`) y `cicapi-csgca` (Express 5 + mysql2) con el estado
actual de `labunam-next` en la rama `legibilidad-codigo`, y propone cambios ordenados
por costo y beneficio. Es una propuesta: nada de lo que describe está aplicado.

## 1. Lo que ya coincide con csgca y conviene conservar

| csgca / cicapi | labunam-next | Comentario |
| --- | --- | --- |
| `endpoints/<entidad>/<Entidad>.js` (clase DAO) | `src/server/<entidad>/<Entidad>Dao.js` | Mismo patrón: clase con SQL, instanciada a nivel de módulo. |
| `endpoints/<entidad>/<entidad>Controller.js` | `src/server/<entidad>/<entidad>Controller.js` | Mismo nombre y misma responsabilidad (validar, responder JSON). |
| `style.module.css` junto a `index.jsx` | `Nombre.module.css` junto a `Nombre.jsx` | Misma idea; el nombre con el componente es mejor para las pestañas del editor. |
| Comentarios en español | Comentarios en español | Misma lengua, aunque con distinta densidad (ver 3.2). |
| Una carpeta por componente | Una carpeta por componente | Igual. |

La migración de `src/lib/catalogo`, `src/lib/db` y `src/lib/filtros` hacia `src/server/`
que está en curso en esta rama acerca el proyecto al esquema de `cicapi` (`endpoints/`).
Es la dirección correcta.

## 2. Dónde se pierde alguien que viene de csgca

1. **No hay `routes.jsx` ni `routes/index.js`.** En csgca el enrutador central lista
   todas las URL y qué componente va en `main` y `aside`. En Next, la carpeta define la
   URL y la página compone sus secciones. El equipo busca un archivo que no existe.
2. **No hay `useCollection` ni `useApiQuery`.** En csgca el dato llega por un hook y
   la vista muestra `isLoading`. En labunam la página es `async`, espera al servicio y
   el HTML sale ya con datos. El "fetch" desaparece del componente y se vuelve
   invisible para quien busca un `useEffect`.
3. **Dos idiomas dentro del mismo archivo.** `filters: filtros`, `laboratorio: lab`,
   `const validos = …` junto a `getFacetValues`, carpetas `buscador/` y `ficha/` con
   funciones `getCapabilities` y `fetchLaboratorioDetails`. En csgca la línea es clara:
   lo que viene de una librería (`@cicunam/sd`, React) va en inglés; lo nuestro, en
   español (`Apoyos`, `concepto`, `fillForm` es la excepción aislada).
4. **Archivos sin encabezado ni secciones.** csgca lee "por ritmo": `Dependencias →
   Componentes → Mecanismos → Estilos → Definición → Estado → Gestores de evento →
   Interfaz`. En labunam los imports, la preparación de datos y el JSX se encadenan sin
   marcas, y los archivos no dicen a qué parte del portal pertenecen.
5. **Acoplamientos que no se ven desde el componente.** La tarjeta no abre la ficha:
   emite `data-details` y `LaboratoryDialog` escucha un clic global en `document`. Un
   lector busca `onClick` en `LaboratoryCard` y no encuentra nada. `public/js/carousel.js`
   mejora HTML de servidor desde fuera de React y administra su montaje a mano.
6. **El catálogo está repartido en muchos archivos pequeños.** `catalogoService`,
   `catalogoSearchService`, `catalogoCache`, `catalogoAssembler`, `catalogoOptions`,
   `catalogoRelations` en `src/server/catalogo/`, más `buscador`, `sugerencias` y
   `capacidades` en `src/lib/`, más `filtros/` en `src/server/`. La pregunta "¿dónde vive
   la búsqueda?" tiene cuatro respuestas.
7. **Dos formas de importar.** Con llaves desde `@/components` en páginas; sin llaves y
   por ruta relativa entre componentes. Está documentado, pero es una regla más que
   memorizar.

## 3. Propuestas

### 3.1 Guía de equivalencias (`docs/00-si-vienes-de-csgca.md`)

Es el cambio más barato y el que más reduce preguntas. Una tabla como esta, con un
enlace al archivo real de labunam en cada fila:

| En csgca hacías… | En labunam-next es… |
| --- | --- |
| Añadir una ruta en `src/routes.jsx` | Crear `src/app/<ruta>/page.jsx` |
| `<Page main={…} aside={…} />` | `src/app/layout.jsx` envuelve; cada `page.jsx` compone sus secciones |
| `useCollection('convocatorias')` en Overview | `const { results } = await searchCatalog(await searchParams)` en `laboratorios/page.jsx` |
| `useInfo(id, 'convocatorias')` en Detail | `await getById((await params).id)` en `laboratorios/[id]/page.jsx` |
| `useApiQuery('ambitos')` desde el navegador | Sólo dos casos: `fetchLaboratorioDetails` (ficha en modal) y el fetch de conteos en `FilterDialog` |
| `routes/index.js` → `router.get('/convocatorias/:id', ctrl.getById)` | `src/app/api/laboratorios/[id]/route.js` → `export { getDetails as GET }` |
| `endpoints/convocatorias/Convocatoria.js` | `src/server/laboratorios/LaboratorioDao.js` |
| `context.json` / `useContext` para filtros y página | La URL (`searchParams`) es el estado; `getCatalogUrl` construye enlaces |
| `@cicunam/sd` (`Card`, `Flexbox`, `Button`) | `src/components/atoms` y `molecules` propios |
| `index.jsx` + `style.module.css` + `index.test.js` | `Nombre.jsx` + `Nombre.module.css` + `Nombre.stories.jsx` |
| `.env.development` / `.env.production` | `.env` administrado por Raúl; `.env.example` como referencia |
| `npm run dev` (Vite, 5173) | `npm run dev` (Next, 3000) |

Añadir también el equivalente de "¿cliente o servidor?": en csgca todo corre en el
navegador; aquí sólo los archivos con `"use client"` lo hacen, y sólo ellos pueden usar
`useState`, eventos y `window`.

### 3.2 Plantilla de archivo con las secciones de csgca

csgca separa con comentarios breves y predecibles. Adoptar las mismas etiquetas no
cambia el código y le devuelve al equipo su forma de leer. Ejemplo con `LaboratoryCard`:

```jsx
// LabUNAM
// Organismos
// LaboratoryCard (tarjeta del catálogo y de la portada)

// Dependencias
import { redes } from "@/lib/presentacion/presentacion";
import { getCapabilities, getCapabilityExcerpt } from "@/lib/capacidades/capacidades";

// Componentes
import Icon from "../../atoms/Icon/Icon";

// Estilos
import styles from "./LaboratoryCard.module.css";

// Definición del componente
const LaboratoryCard = ({ laboratorio, photo, priority = false, matches = [], query = "" }) => {

  // Preparación de datos
  const capacidades = getCapabilities(laboratorio.servicios, laboratorio.equipos, matches);
  const area = laboratorio.grupos?.length === 1 ? laboratorio.grupos[0] : "general";
  …

  // Interfaz
  return ( … );
};

export default LaboratoryCard;
```

Para páginas de servidor las secciones serían `Dependencias → Servicios → Componentes
→ Configuración de Next (metadata, dynamic) → Definición de la página → Datos →
Interfaz`. Para hooks, `Estado → Efectos → Gestores de evento → Valores que regresa`.
La regla ya existe en `AGENTS.md` ("separar imports, preparación de datos, eventos y
JSX"); lo que falta es hacerla visible con etiquetas y aplicarla.

Qué sí conservar de labunam: los comentarios que explican por qué (historial del modal,
caché compartida, conteos). csgca los tiene menos y se nota.

### 3.3 Una sola regla de idioma, la de csgca

La regla actual ("técnico en inglés, dominio en español") deja casos ambiguos y produce
alias en cada frontera. La regla de csgca es más fácil de aplicar sin pensar:

- **Inglés** sólo para lo que viene de fuera o es genérico de interfaz: React, Next,
  props de átomos y moléculas (`size`, `selected`, `label`), clases CSS y tokens.
- **Español** para todo lo nuestro: variables, funciones, servicios, hooks del dominio,
  nombres de organismos (`TarjetaLaboratorio` o conservar `LaboratoryCard`, pero decidirlo
  una vez).

Puntos calientes donde el cambio se nota de inmediato, aunque no se renombre nada más:

- `laboratorios/page.jsx`: `filters: filtros` y `criteria`/`results`/`locations` frente a
  `redes`, `getCatalogUrl`, `filtro.opciones`.
- `LaboratoryCard`, `LaboratoryDetails`, `Contact`: `laboratorio: lab` en la firma de props.
- `buscador.js`: `ejes`, `validos`, `palabras`, `encontrados` junto a `getFacetValues`,
  `normalizeCriteria`, `compareSearchResults`.
- `catalogoSearchService` devuelve `criteria, results, filters, total, locations,
  suggestions, photos` y la página lo vuelve a traducir.

Si el equipo prefiere mantener el inglés que fijaron los últimos commits, la versión
mínima es: prohibir alias en destructuring y no mezclar dentro de una misma función.

### 3.4 Extraer "mecanismos" (hooks) de los organismos grandes

csgca pone la lógica en hooks pequeños con nombre (`useCollection`, `useDetail`,
`usePagination`) y deja los componentes como vista. Tres candidatos:

- **`LaboratoryDialog` → `useLaboratoryDialog`.** El `useEffect` de sesenta líneas con
  `show`, `open` y `syncHistory` anidadas se convierte en un hook que regresa
  `{ lab, error, dialogRef, cerrar }`. El componente queda en JSX. El contrato
  `data-details` se documenta en un solo lugar (el hook) y `LaboratoryCard` lleva un
  comentario de una línea que apunta ahí.
- **`FilterDialog` (275 líneas) → `useDragScroll` + `useFilterDraft`.** El arrastre
  horizontal es de la barra de disciplinas, no del diálogo: mover `useDragScroll` junto
  a `DisciplineBar`. La selección borrador con conteos en vivo es `useFilterDraft`.
- **`public/js/carousel.js` → `Carousel` con `"use client"` y `useCarousel`.** Para un
  equipo React es la pieza más ajena: un script global que detecta montaje y limpieza a
  mano. `AGENTS.md` permite frontera cliente cuando hay interacción, y el carrusel la
  tiene. Conservar el mismo comportamiento (arrastre, infinito, siete segundos, pausas,
  teclado). Riesgo a vigilar: el peso del JavaScript inicial, que ya excede el
  presupuesto documentado; medir antes y después.

Convención propuesta, igual que csgca: hooks compartidos por varios componentes en
`src/hooks/`; hooks de un solo componente junto a él (como ya hacen `Header` y
`SearchBar`).

### 3.5 Un solo cliente HTTP y el mismo sobre de respuesta que cicapi

Hoy `fetchLaboratorioDetails` vive en `src/lib/ficha/ficha.js` y el fetch de conteos
está dentro de `FilterDialog`. csgca concentra eso en `hooks/api.js`. Propuesta:
`src/lib/api/api.js` con `obtenerFicha(id)` y `obtenerFiltros(criterios)`, y que las
dos rutas de `src/app/api/` respondan con el sobre que el equipo ya conoce:

```json
{ "success": true, "data": { … }, "message": "" }
{ "success": false, "message": "El laboratorio no existe." }
```

Es un cambio pequeño en `laboratoriosController`, `filtrosController` y los dos
consumidores.

### 3.6 Consolidar `src/server/catalogo` (opcional)

`catalogoOptions.js` (37 líneas) y `catalogoRelations.js` (30) sólo los usa
`catalogoAssembler.js`. Unirlos en el ensamblador deja tres archivos con nombres que
responden a una pregunta cada uno: `catalogoService` (cargar), `catalogoCache`
(guardar), `catalogoSearchService` (buscar). Y renombrar `src/lib/buscador/` a algo
que diga que es la lógica pura de filtrado que usan tanto el servidor como las pruebas.

### 3.7 Explicar que las historias sustituyen a `index.test.js`

csgca tiene `index.test.js` junto a cada componente. En labunam no hay pruebas
unitarias de componentes: la historia de Storybook cubre los estados visuales y
Playwright cubre la interacción. Decirlo en `docs/05-pruebas.md` evita que alguien
busque dónde "faltan" las pruebas.

## 4. Lo que no conviene copiar de csgca

- `index.jsx` para todos los archivos: dificulta distinguir pestañas y búsquedas.
- Un contexto global tipo `context.json` para filtros y página: en un portal público
  la URL es el estado y permite compartir enlaces.
- Un `routes.jsx` central: Next no lo usa y mantenerlo a mano sería documentación
  que se desactualiza.

## 5. Orden sugerido

1. **Primera tanda (sin tocar lógica):** 3.1 guía de equivalencias, 3.2 plantilla aplicada a los cinco archivos más leídos (`laboratorios/page.jsx`,
   `page.jsx`, `LaboratoryCard`, `LaboratoryDialog`, `catalogoSearchService`), 3.7.
2. **Segunda tanda (refactor acotado con pruebas existentes):** 3.4 `useLaboratoryDialog`
   y `useDragScroll`, 3.5 cliente HTTP y sobre de respuesta.
3. **Tercera tanda (decisión de equipo):** 3.3 regla de idioma, 3.4 carrusel como Client
   Component con medición de peso, 3.6 consolidación del catálogo.

Cada tanda se valida con `npm run lint`, `npm test`, `npm run build` y Playwright en
375/1024/1400 px para las que toquen diálogo, filtros o carrusel.
