// LabUNAM
// Configuración
// main (configuración de Storybook)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

// Configuración
const config = {
  stories: ["../src/components/**/*.stories.jsx"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/nextjs-vite",
  // Añade a Vite los mismos alias que usan Next y Vitest.
  async viteFinal(
    config, // Object - Configuración de Vite que prepara Storybook
  ) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("../src", import.meta.url)),
          "@datosPrueba": fileURLToPath(new URL("../tests/datosPrueba", import.meta.url)),
        },
      },
    });
  },
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
};
export default config;
