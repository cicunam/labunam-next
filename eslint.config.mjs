// LabUNAM
// Configuración
// eslint.config (reglas de lint del proyecto)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import componentExport from "./eslint-rules/component-export.js";

// Configuración
export default defineConfig([
  ...nextVitals,
  {
    // El plan exige img nativo con srcset; las fotos se procesan fuera de Next.
    rules: { "@next/next/no-img-element": "off", curly: ["error", "all"] },
  },
  {
    // Componentes y páginas se declaran como arrow con nombre y export default al final.
    files: ["src/components/**/*.jsx", "src/app/**/*.jsx"],
    plugins: { labunam: { rules: { "component-export": componentExport } } },
    rules: {
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      "labunam/component-export": "error",
    },
  },
  {
    // Componentes y src/lib no pueden importar el backend.
    files: ["src/components/**/*.{js,jsx}", "src/lib/**/*.js"],
    ignores: ["**/*.test.js"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/**", "**/server/**"],
              message:
                "El backend se consume desde páginas de servidor o endpoints. Componentes y lib reciben datos o llaman la API.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
