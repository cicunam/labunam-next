import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // El plan exige img nativo con srcset; las fotos se procesan fuera de Next.
    rules: { "@next/next/no-img-element": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "storybook-static/**", "next-env.d.ts", "test-results/**", "playwright-report/**"]),
]);
