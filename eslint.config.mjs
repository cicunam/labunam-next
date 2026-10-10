import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import componentExport from "./eslint-rules/component-export.js";

export default defineConfig([
  ...nextVitals,
  {
    // El plan exige img nativo con srcset; las fotos se procesan fuera de Next.
    rules: { "@next/next/no-img-element": "off", curly: ["error", "all"] },
  },
  {
    files: ["src/components/**/*.jsx", "src/app/**/*.jsx"],
    ignores: ["**/*.stories.jsx"],
    plugins: { labunam: { rules: { "component-export": componentExport } } },
    rules: {
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
      "labunam/component-export": "error",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
