# Consultar la base de datos

[Volver al índice](README.md)

## El recorrido de los datos

El backend vive en `src/server/`, organizado por entidades como en CICAPI.
Las funciones y constantes compartidas con el navegador permanecen en `src/lib/`.

```text
Página de servidor ───────────────→ Service → DAO → MySQL
Navegador → route.js → Controller → Service → DAO → MySQL
```

Los dos caminos usan los mismos servicios. Una página no llama por HTTP a su propia
API: espera el servicio y genera HTML con los datos, conservando el renderizado en
servidor, títulos, descripciones y URLs públicas.

| Pieza | Responsabilidad | Ejemplo real |
| --- | --- | --- |
| Conexión | Pool único de MySQL y consultas parametrizadas | `src/server/config/dbconnection.js` |
| DAO | SQL de su entidad; devuelve filas | `src/server/laboratorios/LaboratorioDao.js` |
| Mapper | Convierte filas heredadas en un laboratorio | `src/server/laboratorios/laboratorioMapper.js` |
| Service | Coordina datos y selecciona campos públicos | `src/server/laboratorios/laboratoriosService.js` |
| Controller | Valida entrada HTTP y devuelve JSON/estado | `src/server/laboratorios/laboratoriosController.js` |
| Ruta de Next | Conecta la URL con el controlador | `src/app/api/laboratorios/[id]/route.js` |

Los DAO son clases con métodos como `getAll()` y `getAllActive()`. Los servicios y
controladores exportan funciones nombradas. No se necesita un controlador por cada
tabla: sólo lo creamos cuando existe una operación HTTP.

## Ejemplo: leer una ficha

En una página de servidor:

```jsx
import { notFound } from "next/navigation";
import { getById } from "@/server/laboratorios/laboratoriosService";
import { LaboratoryDialog } from "@/components";

const LaboratoryPage = async ({ params }) => {
  const { id } = await params;
  const laboratorio = await getById(id);
  if (!laboratorio) {
    notFound();
  }
  return <LaboratoryDialog initialLaboratorio={laboratorio} />;
};

export default LaboratoryPage;
```

`getById()` valida el ID, busca en el catálogo vigente y agrega fotografías.
Devuelve `null` si el ID es inválido o no existe. Si falla la carga sin respaldo,
propaga un error público. El objeto de salida contiene sólo los campos de la ficha,
no el índice de búsqueda ni filas SQL completas.

El modal, que corre en el navegador, usa `fetchLaboratorioDetails()` de
`src/lib/ficha/ficha.js`. Esta función consulta `/api/laboratorios/[id]`.
La ruta delega a `getDetails()` del controlador, que usa el mismo `getById()`:
400 para ID inválido, 404 si no existe y 503 cuando falla la carga. Nunca responde
con mensajes internos de MySQL. Contacto usa `getContactDetails()` para recibir
sólo sus cinco campos necesarios, sin leer fotografías.

## Cómo se arma el catálogo

1. `catalogoService.js` llama en paralelo a los seis DAO: laboratorios (con sus
   dependencias), estados, disciplinas, equipos, certificaciones y acreditaciones.
2. `catalogoAssembler.js` coordina la transformación de las filas.
3. `catalogoRelations.js` agrupa las relaciones una vez por ID para evitar recorrer
   todas las filas por cada laboratorio.
4. `laboratorioMapper.js` transforma cada laboratorio. `laboratorioFormatting.js`
   contiene las reglas de direcciones, enlaces y distinciones.
5. `catalogoOptions.js` prepara opciones y sugerencias. Las sugerencias incluyen
   disciplinas y hasta 60 equipos presentes en al menos tres laboratorios.

Las disciplinas heredadas están en 38 columnas de banderas. Hay comentarios para
explicar esta particularidad, la sede de respaldo y los micrositios institucionales.
No es necesario entender estas reglas para consumir un servicio desde una página.

`searchCatalog()` prepara resultados y filtros usando la misma copia del catálogo;
`getHomeData()` prepara conteos e incorporaciones de la portada. La búsqueda sigue
operando sobre datos normalizados: seleccionar un chip no provoca una consulta SQL
por cada laboratorio. Las fotos se leen en `src/server/fotos/fotosService.js` y su
selección visual compartida permanece en `src/lib/fotos/fotos.js`.

## Añadir una consulta o un campo

1. Confirmar que el campo existe y puede mostrarse públicamente.
2. Añadir el SELECT al DAO correspondiente, con columnas explícitas, sin `SELECT *`.
3. Si necesita transformación, resolver nulos y valores heredados en el mapper.
4. Exponerlo desde el servicio sólo si la pantalla lo necesita.
5. Actualizar fixtures y pruebas; después consumir el servicio desde la página o controlador.

La conexión ofrece `query(sql, parameters = [])`. Para valores dinámicos, usar
marcadores `?` y parámetros separados:

```js
const rows = await query(
  "SELECT idLab, labNombre FROM r_seccion1 WHERE idLab = ? AND activo = 1 AND idTpLab IN (1, 2, 3, 4)",
  [id],
);
```

Este ejemplo muestra la parametrización dentro de un DAO. La ficha actual reutiliza
el catálogo: no añadas esta consulta por cada tarjeta. Valida formatos y límites de
entrada; nombres de columnas y órdenes deben salir de una lista permitida.

No hay ORM ni migraciones. MySQL es de sólo lectura: no ejecutar INSERT, UPDATE,
DELETE ni ALTER para desarrollar una pantalla o preparar pruebas.

## Caché y pruebas

`catalogoCache.js` conserva una copia por proceso durante 600 segundos por defecto
(`LABUNAM_CATALOGO_SEGUNDOS`). Las cargas simultáneas comparten una promesa. Si
MySQL falla, devuelve la última copia válida; sin copia, devuelve un error público.
No hay una tarea programada: se revisa la vigencia al solicitar datos.

`npm test` recoge pruebas de `src/lib/` y `src/server/`. Las de conexión y catálogo
usan mocks, sin abrir MySQL ni cargar el `.env` real. Las del servicio de laboratorios
verifican campos públicos y respuestas HTTP. Los fixtures están junto al catálogo.
No guardar credenciales ni datos de personas en ejemplos o pruebas.
