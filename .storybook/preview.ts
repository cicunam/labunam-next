import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true },
    a11y: { test: "error" },
    viewport: {
      options: {
        movil: { name: "Móvil · 375 px", styles: { width: "375px", height: "812px" } },
        tableta: { name: "Tableta · 1024 px", styles: { width: "1024px", height: "768px" } },
        escritorio: { name: "Escritorio · 1400 px", styles: { width: "1400px", height: "900px" } },
      },
    },
  },
};
export default preview;
