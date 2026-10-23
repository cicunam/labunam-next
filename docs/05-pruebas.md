# Crear y ejecutar pruebas

[Volver al índice](README.md)

## Qué herramienta usar

| Necesidad | Herramienta | Ubicación |
| --- | --- | --- |
| Comprobar una regla o transformación | Vitest | `*.test.js` junto al módulo en `src/lib/` o `src/server/` |
| Verificar filtros, navegación, teclado o modal | Playwright | `tests/e2e/*.spec.js` |
| Revisar convenciones y errores de código | ESLint | Comandos de proyecto |

Vitest está configurado para **Node** y recoge `src/lib/**/*.test.js` y
`src/server/**/*.test.js`. No asumas
que un test JSX junto al componente se ejecutará o que existe un entorno DOM.
Los estados visuales de un componente se revisan en la página que lo usa, a los tres anchos.

## Prueba unitaria

Un ejemplo que puedes añadir como caso al archivo existente
`src/lib/texto/texto.test.js`:

```js
it("permite comparar una técnica con acentos y espacios", () => {
    expect(normalizeText("  Microscopía  ")).toBe("microscopia");
});
```

Ese archivo ya importa `it`, `expect` y `normalizeText`. `it` describe una conducta,
y `expect` compara el resultado real con el esperado. Para un módulo nuevo,
importa sus funciones desde `./nombreDelModulo` y las utilidades desde `vitest`.

```sh
npm test
npm test -- src/lib/texto/texto.test.js
npm run test:watch -- src/lib/texto/texto.test.js
```

Elige casos normales, límites y errores relevantes: entrada vacía, acentos,
selección sin resultados, fallo de consulta o duplicados según la función.
No copies el algoritmo dentro de la prueba para calcular lo esperado: eso puede
repetir el mismo error. Usa un resultado que represente el requisito.

## Aislar MySQL y servicios

Un **mock** reemplaza una dependencia por una respuesta controlada durante el test.
`src/server/config/dbconnection.test.js` simula `mysql2/promise`; comprueba reutilización del pool y errores
sin abrir conexiones. `src/server/laboratorios/laboratoriosCatalogo.test.js` cubre el armado, la caché y la concurrencia.

Copia esos patrones cuando haga falta: reiniciar mocks entre casos, restaurar
variables simuladas y usar datos ficticios. No cargues `.env` real para unitarias.
No elimines validaciones sólo para que una prueba pase.

## Datos de prueba

Los datos ficticios compartidos viven en `tests/datosPrueba/`, igual que los SQL de
`test/seed/` en cicapi, pero en JavaScript y sin base de datos de por medio:

| Archivo | Forma de los datos | Lo usan |
| --- | --- | --- |
| `catalogo.js` | Filas como las devuelven los DAO de MySQL | Pruebas unitarias de `src/lib/` y `src/server/` |

Se importan con el alias `@datosPrueba/`, por ejemplo
`import { createTestData } from "@datosPrueba/catalogo"`. El alias está configurado en
`jsconfig.json` y `vitest.config.js`. Nunca uses nombres, correos
ni datos reales de personas o laboratorios.

## Prueba en navegador

Primera instalación:

```sh
npx playwright install chromium
npm run test:e2e
```

Sin `PLAYWRIGHT_BASE_URL`, Playwright inicia o reutiliza el servidor de desarrollo
local según la configuración. Las pruebas del portal necesitan base configurada.
La suite corre en 375, 1024 y 1400 px.

Ejemplo para un archivo nuevo `tests/e2e/portada.spec.js`:

```js
import { expect, test } from "@playwright/test";
test("la portada presenta el propósito del buscador", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", {
        name: "Encuentra el laboratorio que necesitas", level: 1,
    })).toBeVisible();
});
```

Para probar una interacción, reproduce los pasos del usuario: abrir un menú,
seleccionar una opción y comprobar el resultado. La navegación de móvil puede
necesitar abrir un menú que en escritorio ya está visible. Usa nombres accesibles (`getByRole`, `getByLabel`) en lugar de clases CSS
generadas. No agregues esperas largas arbitrarias: `expect` espera la condición.

```sh
npm run test:e2e -- tests/e2e/carousel.spec.js
npm run test:e2e -- --project=375px
npm run test:e2e -- --grep 'carrusel'
```

Para comprobar producción, inicia `npm run build` y luego `npm start` en un puerto
libre, y en otra terminal:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007 npm run test:e2e
```

Con esa variable Playwright no inicia el servidor. Si falla la conexión, revisa
que la instancia esté escuchando. Las trazas de fallos se guardan en
`test-results/`; abre el ZIP concreto que generó la ejecución con:

```sh
npx playwright show-trace ruta/al/trace.zip
```

## Qué corre en cada PR

El flujo `.github/workflows/ci.yml` ejecuta en cada PR y en cada commit de master,
con la versión de Node de `.nvmrc`:

```sh
npm ci
npm run lint
npm run format:check
npm test
npm run build
```

No configura MySQL ni secretos. Las unitarias simulan la base, y el build no la
consulta porque portada, catálogo, ficha y solicitud se renderizan bajo demanda.
Si una prueba nueva necesita `.env` o una base real para pasar, fallará en GitHub:
aíslala con un mock como en [Aislar MySQL y servicios](#aislar-mysql-y-servicios).

Playwright no corre en GitHub. Sus pruebas buscan laboratorios, conteos y
equipos del catálogo real, y el repositorio no tiene esquema ni datos ficticios para
levantar una base propia. Ejecútalas en local cuando cambie la interacción.

## Qué ejecutar antes de entregar

El PR repite lint, formato, unitarias y build, pero conviene correrlos antes de
subir para no esperar al flujo. Para código, `npm run lint` y `npm run build`, más
las pruebas del comportamiento modificado. No hay comando de comprobación de tipos; las pruebas protegen las reglas
y el build comprueba que la aplicación puede compilarse.
Para cambios visuales, revisar la página integrada a los tres anchos.
Para documentación, comprobar rutas, ejemplos y formato; no hace falta arrancar
MySQL ni repetir toda la suite.

En el reporte distingue lo ejecutado de lo no comprobado. Si sólo corriste un
archivo de pruebas, no afirmes que pasó la suite completa. No uses cifras históricas
del README como resultados de tu cambio.
