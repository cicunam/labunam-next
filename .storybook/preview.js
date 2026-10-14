// LabUNAM
// Configuración
// preview (parámetros comunes de las historias)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import "../src/app/globals.css";

// Configuración
// Las vistas coinciden con los anchos de Playwright y a11y falla ante cualquier hallazgo.
const preview = {
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true },
    a11y: { test: "error" },
    viewport: {
      options: {
        mobile: { name: "Móvil · 375 px", styles: { width: "375px", height: "812px" } },
        tablet: { name: "Tableta · 1024 px", styles: { width: "1024px", height: "768px" } },
        desktop: { name: "Escritorio · 1400 px", styles: { width: "1400px", height: "900px" } },
      },
    },
  },
};
export default preview;
