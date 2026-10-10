import Carousel from "./Carousel";

const meta = {
  title: "Organismos/Carousel",
  component: Carousel,
  parameters: { layout: "fullscreen" },
  args: {
    slides: ["laboratorio-abc.jpeg", "mision.png", "vision.png"].map((imagen, i) => ({
      imagen: `/assets/images/${imagen}`,
      titulo: `Noticia de ejemplo ${i + 1}`,
      texto: "Contenido de demostración",
      href: "/laboratorios",
      enlace: "Ver laboratorios",
    })),
  },
};
export default meta;
export const Principal = {};
