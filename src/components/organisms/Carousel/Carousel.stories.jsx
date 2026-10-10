import Carousel from "./Carousel";

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
const Default = {};
export { Default };
