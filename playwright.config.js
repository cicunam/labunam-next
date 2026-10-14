// LabUNAM
// Configuración
// playwright.config (pruebas de navegador en 375, 1024 y 1400 px)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { defineConfig } from "@playwright/test";

// Configuración
// Con PLAYWRIGHT_BASE_URL se prueba un servidor ya iniciado; sin ella se levanta el de desarrollo.
export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  projects: [375, 1024, 1400].map((ancho) => ({
    name: `${ancho}px`,
    use: { viewport: { width: ancho, height: 900 } },
  })),
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --hostname 127.0.0.1",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
      },
});
