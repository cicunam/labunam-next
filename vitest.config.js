// LabUNAM
// Configuración
// vitest.config (pruebas unitarias de src/lib, src/server y scripts)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Configuración
// Las unitarias corren en Node; @datosPrueba apunta a los datos ficticios compartidos.
export default defineConfig({
  resolve: {
    alias: { "@datosPrueba": fileURLToPath(new URL("./tests/datosPrueba", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/lib/**/*.test.js", "src/server/**/*.test.js", "scripts/*.test.js"],
  },
});
