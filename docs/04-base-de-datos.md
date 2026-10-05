# Consultar la base de datos

[Volver al índice](README.md)

## El recorrido actual

`lib/db/db.ts` mantiene un pool MySQL: un conjunto pequeño de conexiones
reutilizables, no una conexión nueva por componente. Se crea cuando hace falta y
sobrevive a recargas de módulos en desarrollo. Usa `mysql2/promise`.

`lib/catalogo/catalogo.ts` ejecuta seis consultas SELECT en `buildCatalog()`:
laboratorios y dependencias, estados, disciplinas, equipos, certificaciones y
acreditaciones. `normalizeCatalog()` transforma filas SQL al modelo público.
`loadCatalog()` añade la caché y evita duplicar cargas concurrentes.

| Archivo | Para qué sirve |
| --- | --- |
| `lib/tiposBase/tiposBase.ts` | Tipos de filas que vienen de MySQL |
| `lib/tipos/tipos.ts` | Entidades públicas que usa el portal |
| `lib/normalizeCatalog/normalizeCatalog.ts` | Limpieza y transformación de filas |
| `lib/catalogo/catalogo.ts` | Consultas y caché del conjunto |
| `lib/buscador/buscador.ts` | Búsqueda y facetas sobre datos normalizados |

No hay ORM ni migraciones en este proyecto. El esquema existente se consume en
modo de sólo lectura. No hacer INSERT, UPDATE, DELETE ni ALTER para desarrollar
una pantalla o preparar una prueba.

## Primero reutilizar el catálogo

Para mostrar datos ya disponibles desde una página de servidor:

```tsx
import { loadCatalog } from "@/lib/catalogo/catalogo";

// Ejemplo didáctico de page.tsx, no una ruta ya instalada.
export default async function LaboratoryCountPage() {
  const { laboratorios } = await loadCatalog();
  return <p>Laboratorios disponibles: {laboratorios.length}</p>;
}
```

La función es `async` porque espera datos; `await` obtiene el resultado antes de
usarlo. No llames a tu propia API HTTP desde una página de servidor cuando puedes
reutilizar directamente la función. Si un componente cliente necesita datos al
interactuar, usa una API pública como `/api/laboratorios/[id]`.

El catálogo ya contiene búsqueda y sugerencias; seleccionar un chip no construye
una consulta SQL con el texto del usuario. Antes de añadir consultas por tarjeta,
revisa si puedes resolverlo con los datos existentes y evitar cientos de peticiones.

## Una nueva consulta fija

Si realmente falta un dato, crea un módulo en `lib/`. Por ejemplo, el contenido
de un hipotético `lib/estadisticas/estadisticas.ts`:

```ts
import { query } from "../db/db";

type Conteo = { total: number };

export async function countActiveLaboratorios(): Promise<number> {
  const filas = await query<Conteo>(
    "SELECT COUNT(*) AS total FROM r_seccion1 WHERE activo = 1 AND idTpLab IN (1, 2, 3, 4)"
  );
  return filas[0]?.total ?? 0;
}
```

`query<Conteo>` describe a TypeScript la forma esperada de cada fila. No valida
por sí mismo el resultado en ejecución: el SELECT y los tipos deben coincidir.
Este ejemplo ilustra el helper; para contar el catálogo de una página normalmente
conviene `laboratorios.length`, evitando una consulta adicional.

### Valores dinámicos y parámetros

**El helper actual sólo acepta `query(sql: string)`.** No admite todavía un segundo
argumento con parámetros. No escribir ejemplos como `query(sql, [id])` suponiendo
que ya existe esa funcionalidad, ni concatenar entradas del usuario al SQL.

Si una consulta nueva necesita parámetros, ampliar primero el helper para pasarlos
al mecanismo de parámetros de mysql2, con sus tipos y pruebas. Validar además el
formato y límites de entrada. No intentar proteger una interpolación quitando
comillas manualmente. Los nombres de columnas u órdenes dinámicos deben salir de
una lista permitida, no del texto recibido.

## Incorporar un campo al catálogo

1. Confirmar que el campo existe y puede mostrarse públicamente.
2. Añadirlo explícitamente al SELECT (evitar `SELECT *`) y al tipo de fila SQL.
3. Transformarlo en `normalizeCatalog`; resolver nulos y valores inesperados.
4. Añadirlo al tipo público sólo si la interfaz lo necesita.
5. Actualizar fixtures ficticios y pruebas de normalización.
6. Pasarlo a la interfaz o API seleccionando sólo los campos necesarios.

`app/api/laboratorios/[id]/route.ts` es el patrón real: valida el ID, busca en el
catálogo y selecciona campos públicos. Devuelve 400 para ID inválido, 404 si no
existe y 503 si falla la carga. Nunca devuelve mensajes internos de MySQL.

## Caché y diagnóstico

`LABUNAM_CATALOGO_SEGUNDOS` controla el tiempo de caché, 600 por defecto. Cada
proceso Node tiene su propia copia. Una carga fallida conserva la anterior cuando
existe; al arrancar sin copia y sin base, la petición falla con un mensaje genérico.
No hay una tarea programada que actualice la caché: se revisa al solicitarla.

Para probar un cambio, usa las pruebas de `lib/catalogo/` y `lib/db/`, que sustituyen
el acceso a MySQL por mocks. No necesitas ni debes modificar la base real. Los
valores de `.env` se acuerdan con Raúl y nunca se incluyen en pruebas o capturas.
