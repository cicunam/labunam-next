import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@datosPrueba": fileURLToPath(new URL("./tests/datosPrueba", import.meta.url)) },
  },
  test: { environment: "node", include: ["src/lib/**/*.test.js", "src/server/**/*.test.js"] },
});
