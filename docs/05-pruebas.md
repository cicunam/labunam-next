# Crear y ejecutar pruebas

[Volver al índice](README.md)

## Qué herramienta usar

| Necesidad | Herramienta | Ubicación |
| --- | --- | --- |
| Comprobar una regla o transformación | Vitest | `lib/<modulo>/<modulo>.test.ts` |
| Verificar filtros, navegación, teclado o modal | Playwright | `tests/e2e/*.spec.ts` |
| Inspeccionar estados y diseño de una pieza | Storybook | Junto al componente, `*.stories.tsx` |
| Revisar tipos y convenciones | TypeScript / ESLint | Comandos de proyecto |

Vitest está configurado para **Node** y sólo recoge `lib/**/*.test.ts`. No asumas
que un test JSX junto al componente se ejecutará o que existe un entorno DOM.
Storybook permite revisar componentes, pero una historia por sí sola no demuestra
que una interacción se haya probado automáticamente.

## Prueba unitaria

Un ejemplo que puedes añadir como caso al archivo existente
`lib/texto/texto.test.ts`:

```ts
it("permite comparar una técnica con acentos y espacios", () => {
  expect(normalizeText("  Microscopía  ")).toBe("microscopia");
});
```

Ese archivo ya importa `it`, `expect` y `normalizeText`. `it` describe una conducta,
y `expect` compara el resultado real con el esperado. Para un módulo nuevo,
importa sus funciones desde `./nombreDelModulo` y las utilidades desde `vitest`.

```sh
npm test
npm test -- lib/texto/texto.test.ts
npm run test:watch -- lib/texto/texto.test.ts
```

Elige casos normales, límites y errores relevantes: entrada vacía, acentos,
selección sin resultados, fallo de consulta o duplicados según la función.
No copies el algoritmo dentro de la prueba para calcular lo esperado: eso puede
repetir el mismo error. Usa un resultado que represente el requisito.

## Aislar MySQL y servicios

Un **mock** reemplaza una dependencia por una respuesta controlada durante el test.
`lib/db/db.test.ts` simula `mysql2/promise`; comprueba reutilización del pool y errores
sin abrir conexiones. `lib/catalogo/catalogo.test.ts` cubre la caché y concurrencia.

Copia esos patrones cuando haga falta: reiniciar mocks entre casos, restaurar
variables simuladas y usar fixtures ficticios. No cargues `.env` real para unitarias.
No elimines validaciones sólo para que una prueba pase.

## Prueba en navegador

Primera instalación:

```sh
npx playwright install chromium
npm run test:e2e
```

Sin `PLAYWRIGHT_BASE_URL`, Playwright inicia o reutiliza el servidor de desarrollo
local según la configuración. Las pruebas del portal necesitan base configurada.
La suite corre en 375, 1024 y 1400 px.

Ejemplo para un archivo nuevo `tests/e2e/portada.spec.ts`:

```ts
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
npm run test:e2e -- tests/e2e/carousel.spec.ts
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

## Qué ejecutar antes de entregar

Para código, `npm run lint` y `npm run build`, más las pruebas del comportamiento
modificado. `npm run typecheck` comprueba tipos sin compilar la aplicación completa.
Para cambios visuales, revisar Storybook y la página integrada a los tres anchos.
Para documentación, comprobar rutas, ejemplos y formato; no hace falta arrancar
MySQL ni repetir toda la suite.

En el reporte distingue lo ejecutado de lo no comprobado. Si sólo corriste un
archivo de pruebas, no afirmes que pasó la suite completa. No uses cifras históricas
del README como resultados de tu cambio.
