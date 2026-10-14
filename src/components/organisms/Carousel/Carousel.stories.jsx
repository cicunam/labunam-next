// LabUNAM
// Historias
// Carousel.stories (carrusel de noticias de la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Carousel from "./Carousel";

// Configuración de la historia
const meta = {
  title: "Organismos/Carousel",
  component: Carousel,
  parameters: { layout: "fullscreen" },
  args: {
    slides: ["laboratorio-abc.jpeg", "mision.png", "vision.png"].map((image, i) => ({
      image: `/assets/images/${image}`,
      title: `Noticia de ejemplo ${i + 1}`,
      description: "Contenido de demostración",
      href: "/laboratorios",
      linkLabel: "Ver laboratorios",
    })),
  },
};
export default meta;

// Historias
// Carrusel con tres noticias de ejemplo
const Default = {};
export { Default };
