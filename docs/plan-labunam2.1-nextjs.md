# Plan de trabajo: LabUNAM 2.1 en Next.js

Documento para ejecutar la reconstrucción del portal LabUNAM en Next.js. Está escrito
para que un agente o una persona pueda arrancar sin más contexto que este archivo y
los repos que menciona. Fecha: 2 de octubre de 2026. Responsable: Raúl Salinas.

---

## 1. Contexto en diez líneas

- **Producto:** rediseño del portal público labunam.unam.mx, el catálogo de laboratorios
  de la UNAM (Nacionales, Universitarios, Unidades de Apoyo), para la Coordinación de la
  Investigación Científica (CIC). Diseño base de Carlos (UI/UX), ya implementado y validado.
- **Qué existe:** `~/Documents/GitHub/labunam2`, rama `propuesta-raul-2`, implementación
  completa en PHP 8.5 + Flight + Latte con CSS y JS a mano. **Es la referencia visual y
  funcional.** Todo lo que se construya debe verse y comportarse igual, salvo lo que este
  plan cambia a propósito.
- **Decisión del 2 de octubre de 2026:** el equipo reconstruye el sitio en **Next.js** en un
  repo nuevo, `~/Documents/GitHub/labunam2.1`. El repo PHP no se toca más que para leerlo.
- **Equipo:** sabe React y Atomic Design; es nuevo en Next.js. El jefe valora código
  **extremadamente fácil de leer**. Cada decisión técnica se mide con esa vara.
- **Base de datos:** MySQL 8 de la UNAM, esquema `labunam_app` (ver §5). Credenciales en
  el `.env` de `labunam2`, que **no se lee**: se copia a mano por Raúl al repo nuevo.
- **Evidencia que manda:** informe de diagnóstico CGCP (nov 2025). Facilidad de uso y
  velocidad de carga son las prioridades 1 y 2. Queja central: el buscador sólo encuentra por
  nombre, no por lo que el laboratorio puede hacer. Sin paginación: facetas con conteo.

---

## 2. Reglas de trabajo (no negociables)

1. **Nunca leer, copiar ni imprimir `.env`** ni archivos de credenciales. Si hace falta un
   valor, se le pide a Raúl que lo ponga él. Sólo se escribe `.env.example`.
2. **Carpetas temporales:** usar el scratchpad de la sesión, nunca `/tmp`.
3. **Git:** siempre `cd` al repo antes de cualquier comando. Mensajes cortos, en minúsculas,
   en español, una línea ("esqueleto next", "tarjeta con storybook"). **Sin `Co-Authored-By`
   ni trailers de IA.** Se commitea al cerrar cada hito de §8 y se avisa a Raúl; no se hace push
   sin que lo pida.
4. **Comentarios de código en español**, sólo cuando el porqué no es obvio. Nada de comentarios
   que repitan lo que el código ya dice.
5. **No proponer otro framework, otra librería de estado, Tailwind ni CSS-in-JS.** La lista de
   lo que no se usa está en §4 y sólo cambia con una razón escrita en el README.
6. **Verificar en el navegador** a 375, 1024 y 1400 px antes de dar algo por terminado. Nunca
   pedirle a Raúl que verifique a mano algo que se puede verificar con la herramienta de
   previsualización.
7. **Datos de prueba sin personas reales**: ningún test o historia de Storybook lleva nombres,
   correos o teléfonos de responsables de laboratorio.

---

## 3. Qué se construye

Tres páginas más una ficha, **sólo en español** (`<html lang="es">`). Se decidió el 2 de
octubre no hacer el sitio bilingüe: el catálogo, los servicios y los textos institucionales
existen únicamente en español, y traducir sólo la interfaz sería una promesa a medias. Si la
CIC entrega textos en inglés y la base agrega campos traducidos, se añade una capa de idioma
después; mover las rutas bajo un segmento de idioma es trabajo de un día, no una reconstrucción.

| URL | Qué es |
| --- | --- |
| `/` | Portada: redes, recién incorporados, áreas, noticias, institucional |
| `/laboratorios?q=&tipo=&disciplina=&especialidad=&sede=&perfil=&reconocimiento=` | Catálogo con tira de áreas, modal de filtros con conteos y retícula de tarjetas |
| `/laboratorios/18` | Ficha con URL propia (nuevo respecto a PHP) |
| `/contacto` | Formulario de contacto con el diseño nuevo |
| `/api/laboratorios/18` | JSON de un laboratorio para la ficha modal |

Redirecciones 301 en `next.config.ts`: `/nacionales`, `/universitarios`, `/unidades`,
`/internacionales` → `/laboratorios?tipo=…`; `/buscar?x` → `/laboratorios?x`.

### 3.1 La portada

Copiar de `labunam2/src/views/pages/inicio.latte` y `public/css/pages/inicio.css`. Secciones
en orden: redes (tres tarjetas apaisadas con el total real de laboratorios bajo cada título),
recién incorporados (cuatro tarjetas ordenadas por fecha de aprobación descendente), áreas
(diez enlaces con conteo), noticias (carrusel de Carlos, con datos ficticios por ahora),
institucional ("¿Qué es LabUNAM?", Misión, Visión: **texto literal de labunam.unam.mx, nunca
parafraseado**).

Titular del bloque de redes, ya decidido: «No hace falta ser de la UNAM / Investigadores,
empresas y dependencias pueden solicitar servicios en cualquiera de las tres redes.»

### 3.2 El catálogo

Copiar de `laboratorios.latte`, `components/filter.latte`, `components/card.latte`,
`pages/laboratorios.css`, `components/filter.css`, `components/card.css`.

- **Tira de áreas:** diez grupos con icono SVG (los `path` están en `filter.latte`), con
  "Todas" al frente y flechas de desplazamiento. Es navegación: enlaces, no controles.
- **Modal `<dialog>` de filtros** con cinco ejes, cada opción como píldora con su conteo; las
  que dan cero se desactivan salvo la elegida. Ejes y claves exactas:
  - `disciplina`: los diez grupos (§6.3).
  - `especialidad`: las 38 disciplinas del catálogo, por clave de URL, ordenadas por conteo.
  - `sede`: estados de la república con laboratorios, ordenados por conteo.
  - `perfil`: `servicios` (Presta servicios), `docencia` (Apoya la docencia), `basica`
    (Investigación básica), `aplicada` (Investigación aplicada).
  - `reconocimiento`: `certificacion` (Con certificación), `acreditacion` (Con acreditación),
    `micrositio` (Con micrositio en LabUNAM).
- **Chips de filtros activos** con "Limpiar todo".
- **Retícula** 1/2/3/4 columnas a 0/744/992/1128 px. **Sin paginación.**
- **Tarjeta:** foto cuadrada con insignia de red, título (botón que abre la ficha; su `::after`
  cubre toda la tarjeta), entidad, sede, y la línea "N servicios · M equipos" que se oculta si
  ambos son cero. `<img srcset sizes loading="lazy">`, no `next/image`.
- **Buscador segmentado** (Qué buscas / Red / Sede / orbe naranja) con sugerencias por teclado,
  búsquedas recientes en `localStorage` y atajo `/`. Lógica actual en `public/js/search.js`.
  Las clases `.search-input`, `.search-lista`, `.search-opcion` pueden cambiar de nombre al
  pasar a módulos, pero el comportamiento se conserva.

### 3.3 La ficha

Un solo `<dialog>` compartido que se llena pidiendo `/api/laboratorios/{id}`. Galería (una
grande y dos chicas), insignia, título, entidad, sede, cuatro pestañas (Servicios,
Equipamiento, Distinciones, Ubicación con enlace "Ver en el mapa"), pie con cifras y botón
"Sitio web" que se oculta si no hay sitio. Pestaña vacía: «Sin información registrada todavía.»
La página `/laboratorios/[id]` muestra lo mismo sin modal, con `metadata` propia.

### 3.4 Tokens y estilo

`labunam2/public/css/tokens.css` es la fuente: azul institucional `#012A56`, naranja de marca
`#F4721D` como único acento (botones primarios con texto blanco por decisión de imagen aunque
dé 2.8:1; hover `#D9600F`), Inter, títulos 32/26/22/18/16, cuerpo 16/14/12/11, radios 4 a
32 px, una sola sombra `--sombra`, tinte de banda `--superficie-tinte: #EFF3F9` y máscara de
onda `--onda`. Cabecera plana de 80 px (64 en móvil): escudo UNAM, LabUNAM, píldora de búsqueda
compacta (oculta en móvil), navegación y hamburguesa. El bloque de buscador alto vive fuera de
la barra y se pliega al bajar con `IntersectionObserver` (`public/js/menu.js`).

Rarezas ya conocidas que se heredan: `<dialog>` alterna `display: none/block`, así que un
`display: flex` va sobre `&[open]`; `::backdrop` no hereda variables CSS, usar color literal;
`<address>` sale en cursiva, poner `font-style: normal`.

---

## 4. Decisiones técnicas

| Tema | Decisión |
| --- | --- |
| Framework | Next.js última estable, App Router, TypeScript, `create-next-app` sin Tailwind, con ESLint, con alias `@/` a la raíz, **sin** carpeta `src/` |
| Next que sí se usa | rutas por carpetas, componentes de servidor por omisión, `searchParams`, Route Handlers, `redirects()`, `metadata`, `generateStaticParams` sólo si hace falta |
| Next que **no** se usa hasta tener razón escrita | middleware, Server Actions, `next/image`, parallel/intercepting routes, ISR, `unstable_*` |
| Librerías permitidas | `mysql2`, `sharp` (sólo el script), `vitest`, `@playwright/test`, Storybook (`@storybook/nextjs-vite`, addon a11y, addon viewport). Nada más sin razón |
| Prohibido | Redux/Zustand/Jotai, Tailwind, CSS-in-JS, styled-components, archivos barril `index.ts`, HOCs, `any`, configuración personalizada de webpack |
| Estilo | **CSS Modules colocados** (`Tarjeta.module.css` junto a `Tarjeta.tsx`). Global sólo `app/globals.css` con tokens, reset y retícula de página, menos de 300 líneas |
| Componentes | Atomic Design: `components/atoms`, `components/molecules`, `components/organisms`; las plantillas son los `layout.tsx` de `app/`. Archivos planos por nivel, tres por componente: `.tsx`, `.module.css`, `.stories.tsx` |
| Lógica | `lib/` sin React, con prueba al lado (`buscador.test.ts`) |
| Nombres | dominio en español (`Tarjeta`, `Ficha`, `laboratorio`, `sede`), vocabulario React en inglés (`props`, `onClose`, `children`) |
| Tamaño | ningún componente pasa de 150 líneas; props tipadas en la misma línea de la función |
| Idioma | sólo español; los textos de interfaz se escriben directamente en los componentes, sin capa de traducción |
| Caché del catálogo | objeto en memoria con fecha de vencimiento (600 s), en `lib/catalogo.ts`; si la base falla y hay copia, se sirve la copia. Diez líneas, sin Next |
| Imágenes | `<img srcset>` desde `public/fotos/<idLab>/N-480.webp` etc. generadas por `scripts/fotos.ts` |
| Presupuesto | catálogo ≤ 120 KB gzip de JS+CSS (el sitio PHP pesa 25 KB). Se mide con Lighthouse y se anota en el README |
| Node | versión LTS vigente; `.nvmrc` en el repo |

---

## 5. La base de datos

Conexión con `mysql2/promise`, un solo pool en `lib/db.ts`. Variables en `.env`:

```
LABUNAM_DB_HOST=
LABUNAM_DB_NAME=labunam_app
LABUNAM_DB_USER=
LABUNAM_DB_PASS=
LABUNAM_FOTOS_ORIGEN=/Users/raul.salinas/Documents/GitHub/labunam-servidor/site/micrositio/img
LABUNAM_CATALOGO_SEGUNDOS=600
```

El esquema vivo es **`labunam_app`** (actualizado sep 2026). `labunam` es una copia de 2024
sin la columna `activo`; `labunam_app_2023/2024/2025` y `labunam_refactorizacion` son
instantáneas. El usuario de base ve todos los esquemas: para explorar sirve
`SELECT ... FROM labunam_app.tabla`. No hay volcado `.sql`; para ver una tabla, `DESCRIBE`.

### 5.1 Población y campos

```sql
SELECT s.idLab, s.labNombre, s.siglas, s.idTpLab, s.entidad AS idEstado,
       s.calleNum, s.colonia, s.muniDeleg, s.cp, s.latitud, s.longitud,
       s.webLab, s.palabrasClave, s.subDis, s.marcaAutorizaInfoWeb,
       s.objInvesApli, s.objInvesBasica, s.objDocencia, s.objServicios,
       COALESCE(s.fAprobacion, s.fActualiza, s.fAplica) AS fecha,
       d.dependencia, d.iniciales, d.idEstado AS idEstadoDepen,
       cd.dep_nombre_may_min AS dependenciaTitulo,
       s.dis1, s.dis2, ... , s.dis38
FROM r_seccion1 AS s
LEFT JOIN catDepen AS d ON d.idDepen = s.idDepen
LEFT JOIN catalogo_dependencias AS cd ON cd.dep_clave = d.dep_clave
WHERE s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)
ORDER BY s.labNombre
```

Da 609 laboratorios: 43 nacionales, 111 universitarios, 452 unidades de apoyo, 3
internacionales. `idTpLab`: 1 internacionales, 2 nacionales, 3 universitarios, 4 unidades.
Hay tres laboratorios de prueba sin tipo; el `IN (1,2,3,4)` los excluye.

Otras consultas, todas sin filtro (se agrupan por `idLab` en código):

- `SELECT idLab, nombre, tpPruebasServicio FROM r_equipoPrincipal ORDER BY idLab, idEquipoPrinci`
  → equipos (nombre) y **servicios** (`tpPruebasServicio`, texto libre, a veces párrafos).
  Se quitan repetidos comparando sin acentos ni mayúsculas.
- `SELECT idLab, certificacion AS nombre, organismo, fFin FROM r_certificaciones WHERE TRIM(certificacion) <> ''`
- `SELECT idLab, acreditacion AS nombre, organismo, fFin FROM r_acreditaciones WHERE TRIM(acreditacion) <> ''`
  → distinciones con el formato «Certificación: ISO 9001:2015 · Certimex (vigencia 2020)».
- `SELECT idEstado, estado FROM catEstados` (mayúsculas sin acentos; ver §6.2).
- `SELECT idDis, disiplina FROM catDisiplina WHERE idDis BETWEEN 1 AND 38` (sic, "disiplina").

Cosas que **no** hay que usar: las vistas `datosLab`, `LabDisciplinas` y `busqueda_laboratorios_sitio`
(están sobre tablas `sa_` desactualizadas o mezclan otras fuentes); `r_premios` (datos basura);
`r_infoWeb.servicios` (la columna no existe en `labunam_app`).

### 5.2 Cobertura real, para no diseñar sobre datos que no existen

| Dato | Laboratorios con dato (de 609) |
| --- | --- |
| Entidad con acentos (`dep_nombre_may_min`) | 567; el resto se arregla con `titulo()` |
| Sede por estado | 603 |
| Alguna disciplina | 596 |
| Algún equipo | 536 |
| Algún servicio | 484 |
| Certificación o acreditación | 44 |
| Coordenadas | 237 |
| Sitio web o micrositio | 504 |
| Fotos propias (micrositio) | 72, casi todos nacionales |

---

## 6. Lógica a portar, con su origen en PHP

Leer los tres archivos antes de escribir TypeScript; son cortos y están comentados:
`labunam2/src/Texto.php`, `labunam2/src/Buscador.php`, `labunam2/src/Catalogo.php`.

### 6.1 `lib/texto.ts`

- `plano(t)`: minúsculas sin acentos (á é í ó ú ü ñ). Base de toda comparación.
- `clave(t)`: `plano` más guiones, para URLs (`ciencias-de-la-tierra-e-ingenierias`).
- `titulo(t, conservar = [])`: la base guarda nombres en MAYÚSCULAS; se convierte a
  «Laboratorio Nacional HAWC de Rayos Gamma». Reglas: si menos del 85 % de las letras son
  mayúsculas, se deja como está (ya lo escribieron a mano); palabras menores (de, del, la, y,
  e, en, …) en minúscula salvo al inicio; se conservan intactas las siglas del laboratorio y de
  la entidad, una lista corta de siglas comunes (UNAM, ISO, ADN, RMN, HPLC, IA, …), palabras con
  dígitos y palabras entre paréntesis.

### 6.2 `lib/catalogo.ts`

Devuelve `{ laboratorios, sedes, disciplinas, sugerencias }` y lo guarda en memoria 600 s.
Cada laboratorio tiene exactamente estos campos (tipo `Laboratorio` en `lib/tipos.ts`):

```
idLab, nombre, siglas, tipo ('nacionales'|'universitarios'|'unidades'|'internacionales'),
entidad, entidadSiglas, sede (clave), sedeNombre, grupos (claves de §6.3), disciplinas
(nombres), palabrasClave, servicios[], equipos[], distinciones[], certificado, acreditado,
micrositio, perfil ('servicios'|'docencia'|'basica'|'aplicada')[], ubicacion, mapa, sitio,
fecha, indice
```

- **Sede:** `catEstados[idEstado]` del laboratorio; si es 0 o nulo, el de la dependencia.
  Etiquetas: `MEXICO` → «Estado de México», `QUERETARO` → «Querétaro», `MICHOACAN` →
  «Michoacán», `YUCATAN` → «Yucatán», `BAJA CALIFORNIA NORTE` → «Baja California»,
  `DISTRITO FEDERAL` → «Ciudad de México»; el resto con `titulo()`. `NO ESPECIFICADO` = sin sede.
- **Ubicación:** calleNum, colonia, muniDeleg (con `titulo`), «C.P. nnnnn»; sin ceros ni vacíos.
- **Mapa:** `https://www.google.com/maps?q=lat,lng` si ambos existen.
- **Sitio:** si `marcaAutorizaInfoWeb = 2`, `https://labunam.unam.mx/micrositio/index.php?il=<idLab>`;
  si no, `webLab` con `http://` si le falta protocolo; si no, vacío.
- **Índice de búsqueda:** `plano` de nombre, siglas, entidad, iniciales, palabrasClave, subDis,
  disciplinas, equipos y servicios unidos por ` | `.
- **Sugerencias:** las 38 disciplinas más los 60 equipos más frecuentes (los que declaran 3 o
  más laboratorios), en formato título. No incluir nombres de laboratorio: serían 609 nodos en
  cada página.
- **Sedes:** sólo las que tienen laboratorios, ordenadas por conteo descendente.

### 6.3 Grupos de la tira (mapa de las 38 disciplinas a 10 áreas)

Pendiente de validar con la CIC, pero es lo que va:

| Clave | Etiqueta | idDis |
| --- | --- | --- |
| biologia | Biología | 4, 6, 20, 19, 31, 1, 38, 35 |
| salud | Salud | 9, 5, 28, 15, 16, 34, 29 |
| quimica | Química | 36 |
| fisica | Física | 17, 18, 3, 37, 32 |
| materiales | Materiales | 10, 30 |
| computo | Matemáticas y cómputo | 26, 27 |
| tierra | Ciencias de la Tierra | 21, 24, 22, 23, 7, 11, 33 |
| ingenieria | Ingeniería | 25, 8 |
| sostenibilidad | Sostenibilidad | 12, 13, 14 |
| humanidades | Humanidades | 2 |

Un laboratorio puede estar en varios grupos.

### 6.4 `lib/buscador.ts`

- `filtrar(laboratorios, criterios)`: los criterios son los siete parámetros de URL. Un valor
  que no exista en las opciones se ignora, no vacía el catálogo. `q` se parte en palabras con
  `plano`; **todas** deben aparecer en `indice`, en cualquier orden. Resultado con
  `coincidencias` (equipos y servicios que contienen las palabras) y `enNombre`. Orden con `q`:
  primero los que coinciden en nombre o siglas, luego por número de coincidencias, luego por
  nombre. Sin `q`: alfabético.
- `contarEje(laboratorios, criterios, eje, valores)`: cuántos resultados daría cada valor del
  eje conservando el resto de criterios. Una pasada por eje. Con 609 laboratorios y cinco ejes
  cuesta menos de 2 ms en PHP; en Node debe ser parecido.

### 6.5 `scripts/fotos.ts`

Portar `labunam2/bin/fotos.php` con `sharp`. Recorre `LABUNAM_FOTOS_ORIGEN/<idLab>/`, elige
hasta tres fotos por laboratorio por la palabra que contiene el nombre de archivo (carrusel1,
carrusel2, carrusel3, luego fondo, infra, antece; si hay dos `Carrusel1` con marca de tiempo,
gana la más reciente), las endereza por EXIF, genera WebP calidad 80 a 480, 960 y 1440 px sin
agrandar, en `public/fotos/<idLab>/<n>-<ancho>.webp`, y escribe `public/fotos/manifiesto.json`:

```json
{ "18": [ { "src": "/fotos/18/1-960.webp", "srcset": "/fotos/18/1-480.webp 480w, /fotos/18/1-960.webp 960w" }, ... ] }
```

`public/fotos/` va en `.gitignore`. Los laboratorios sin foto usan tres imágenes de respaldo
rotadas por `idLab % 3` (`laboratorio-abc.jpeg`, `mision.png`, `vision.png`, en
`labunam2/public/assets/images/`); el juego de ilustraciones por área es tarea de Carlos.
`ilustracion-inicio.png` es una maqueta: no usarla. En el servidor, el origen será la carpeta
real `labunam/micrositio/img`.

---

## 7. Estructura del repo

```
labunam2.1/
├── app/
│   ├── globals.css                     tokens, reset, retícula; único CSS global
│   ├── layout.tsx                      <html lang="es">, fuentes, cabecera, bloque de buscador, pie
│   ├── page.tsx                        portada
│   ├── laboratorios/page.tsx           catálogo
│   ├── laboratorios/[id]/page.tsx      ficha con URL propia
│   ├── contacto/page.tsx
│   └── api/laboratorios/[id]/route.ts
├── components/
│   ├── atoms/        Boton, Pildora, Insignia, Icono, Campo, Enlace
│   ├── molecules/    SegmentoBuscador, OpcionFiltro, ChipActivo, Pestana, Galeria
│   └── organisms/    Cabecera, Pie, Buscador, TiraDisciplinas, ModalFiltros, Tarjeta, Ficha, Carrusel
│                     (cada uno: X.tsx, X.module.css, X.stories.tsx)
├── lib/              db.ts, catalogo.ts, buscador.ts, texto.ts, tipos.ts (+ *.test.ts)
├── scripts/          fotos.ts
├── public/           assets/ (logos, respaldo), fotos/ (generada, ignorada)
├── tests/e2e/        portada.spec.ts, catalogo.spec.ts, contacto.spec.ts
├── .storybook/       main.ts, preview.ts (importa globals.css; viewports 375/1024/1400)
├── .env.example  .gitignore  .nvmrc  next.config.ts  tsconfig.json  package.json  README.md
```

Para decidir dónde va algo: si pinta, `components/` según cuánto sabe del dominio (los átomos
y moléculas no saben qué es un laboratorio); si calcula, `lib/`; si es una URL, `app/`.

---

## 8. Fases, tareas y criterios de aceptación

Cada hito termina con: verificación en navegador a 375/1024/1400, `npm run lint`,
`npm test`, Storybook arrancando sin errores, y un commit con aviso a Raúl.

### Hito 0: cimientos (2 a 3 días)

1. `npx create-next-app@latest labunam2.1` con TypeScript, ESLint, App Router, sin Tailwind, sin
   `src/`, alias `@/*`. `.nvmrc` con la LTS. Quitar todo el contenido de ejemplo.
2. `redirects()` de §3 en `next.config.ts`; `app/layout.tsx` con `lang="es"`, fuente Inter y
   cabecera y pie reales.
3. Copiar `tokens.css` a `app/globals.css` junto con el reset actual; copiar `public/assets`.
4. Storybook con `@storybook/nextjs-vite`, addon a11y, viewports 375/1024/1400, `preview.ts`
   importando `globals.css`. Un átomo de ejemplo completo (`Boton`) con sus tres archivos, para
   que el equipo copie el patrón.
5. Vitest configurado; `lib/texto.ts` portado con sus pruebas (ver §9).
6. README con: propósito, cómo correr, las reglas de §4, la lista de "no usamos", el
   presupuesto de peso, cómo correr Storybook, pruebas y el script de fotos.
7. **Entregar a Raúl la lista de preguntas para el administrador del servidor** (§10).
   Es el riesgo número uno y hay que despejarlo en esta semana.

Aceptación: `npm run dev` muestra `/` con cabecera y pie reales; Storybook muestra
`Boton` en tres tamaños; las pruebas de `texto` pasan.

### Hito 1: lógica y piezas chicas (semana 1)

1. `lib/db.ts`, `lib/catalogo.ts`, `lib/buscador.ts`, `lib/tipos.ts`, con pruebas (§9). Probar contra `labunam_app` con un script en el scratchpad que no imprima
   credenciales ni datos de personas.
2. Átomos y moléculas con historia: Pildora, Insignia, Icono (los 11 `path` SVG de la tira),
   Campo, Enlace, SegmentoBuscador, OpcionFiltro, ChipActivo, Pestana, Galeria. CSS tomado de
   los archivos de `labunam2/public/css/components/`, pasado a módulo.

Aceptación: `catalogo.test.ts` construye 609 laboratorios desde la base en menos de 500 ms;
«microscopia» da 38 resultados; cada átomo y molécula tiene historia y pasa a11y en Storybook.

### Hito 2: organismos y las dos páginas (semana 2)

1. Cabecera (con el pliegue del buscador por `IntersectionObserver`), Pie, Buscador (sugerencias,
   recientes, atajo `/`), TiraDisciplinas, ModalFiltros, Tarjeta, Ficha, Carrusel. Sólo
   Cabecera/menú, Buscador, ModalFiltros y Ficha llevan `'use client'`.
2. `app/page.tsx` y `app/laboratorios/page.tsx` con datos reales, más
   `app/api/laboratorios/[id]/route.ts`.

Aceptación: el catálogo se ve igual que `http://127.0.0.1:8765/laboratorios` del repo PHP en
los tres anchos; `?q=microscopia&tipo=nacionales` da 7 resultados; las píldoras con cero
están desactivadas; abrir una tarjeta pide el JSON una sola vez.

### Hito 3: lo que rodea (semana 3)

1. `scripts/fotos.ts` y `npm run fotos`; correrlo contra la copia local y comprobar 62
   laboratorios con foto real en el catálogo.
2. `laboratorios/[id]/page.tsx` con `metadata` (título «<nombre> | LabUNAM», descripción con
   entidad y sede). `contacto/page.tsx` con el diseño nuevo (hoy en PHP sigue con el viejo:
   diseñarlo con los mismos átomos; el envío queda como `mailto:` o deshabilitado hasta tener
   backend de correo).
3. Playwright: tres páginas en tres anchos, más los casos de §9.
4. Lighthouse en el catálogo: anotar JS+CSS gzip en el README; si pasa de 120 KB, reducir
   componentes cliente antes de seguir.

Aceptación: `npm run build` sin advertencias; Playwright en verde; Lighthouse de rendimiento
≥ 90 en móvil.

### Hito 4: servidor y cierre (semana 4)

1. Desplegar en el servidor de desarrollo de la UNAM según lo que haya respondido el
   administrador (§10). Documentar en el README el procedimiento exacto.
2. Revisión con Ivonne (CIC) y correcciones.
3. Fotos: correr el script en el servidor contra la carpeta real.

Aceptación: la URL de desarrollo responde con el catálogo real; Raúl y Carlos lo aprueban.

---

## 9. Pruebas que deben existir

Unitarias (Vitest, junto a cada archivo de `lib/`):

- `plano('Microscopía Óptica') === 'microscopia optica'`.
- `titulo('LABORATORIO NACIONAL HAWC DE RAYOS GAMMA', ['HAWC']) === 'Laboratorio Nacional HAWC de Rayos Gamma'`.
- `titulo('Laboratorio de Nanosensores Biofotónicos')` no cambia.
- `clave('Ciencias de la Tierra e Ingenierías') === 'ciencias-de-la-tierra-e-ingenierias'`.
- `filtrar` con `q: 'microscopia'` encuentra laboratorios cuyo nombre lleva «Microscopía».
- `filtrar` con `q: 'xyzzy'` devuelve vacío sin lanzar error.
- Para cada eje, la suma de `contarEje` sobre las opciones es ≥ el total de resultados (un
  laboratorio puede tener varias disciplinas) y para `tipo` y `sede` es exactamente igual.
- Toda clave de sede y de especialidad es única.
- Un valor de criterio inexistente se ignora y no vacía el catálogo.

Extremo a extremo (Playwright, 375/1024/1400):

- Portada carga, muestra tres redes con total mayor que cero y cuatro recién incorporados.
- `/laboratorios?q=rayos%20x` muestra resultados y el chip «rayos x»; quitar el chip vuelve
  a mostrar más de 600.
- Abrir el modal, elegir una sede, enviar: la URL lleva `sede=` y el conteo baja.
- Pulsar una tarjeta abre la ficha con el título correcto; `Escape` la cierra.
- `/nacionales` redirige 301 a `/laboratorios?tipo=nacionales`.

---

## 10. Preguntas para quien administra el servidor (bloqueante)

El sitio actual es una carpeta PHP servida por Apache 2.4 en Ubuntu 20.04 (desarrollo en
`132.248.31.71`, producción labunam.unam.mx). Next.js necesita un proceso Node vivo. Hay que
saber antes del hito 2:

1. ¿Se puede instalar Node LTS en el servidor (desarrollo y producción)? ¿Quién lo instala?
2. ¿Cómo se mantiene el proceso vivo tras un reinicio: `systemd`, `pm2`, otro?
3. ¿Apache puede hacer proxy inverso (`mod_proxy`) de labunam.unam.mx al puerto de Node?
4. ¿Cómo se despliega hoy el sitio PHP (copia manual, git pull, otro)? Replicar el mismo
   canal para `npm run build` + reinicio del proceso.
5. ¿La carpeta real de fotos `labunam/micrositio/img` será legible por el usuario que corra Node?
6. ¿Existe un servidor de desarrollo con URL pública donde Ivonne y la CIC puedan revisar?

Si la respuesta a 1 a 3 es no, el plan cambia a `output: 'export'` con el catálogo filtrado
en el cliente, y eso hay que decidirlo con Raúl antes de construir las páginas.

---

## 11. Lo que queda fuera de este plan

- Ilustraciones de respaldo por área (Carlos).
- Versión en inglés: descartada para el lanzamiento; requeriría textos institucionales y
  campos del catálogo traducidos por la CIC.
- Validar con la CIC el mapa de 38 disciplinas a 10 áreas y el alcance del titular «No hace
  falta ser de la UNAM» para universitarios y unidades.
- Noticias reales para el carrusel.
- Backend de envío del formulario de contacto.
- Chat con laboratorios y portal de clientes (pedidos en el diagnóstico; versión posterior).
