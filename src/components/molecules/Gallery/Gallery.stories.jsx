import Gallery from "./Gallery";

const meta = {
  title: "Moléculas/Gallery",
  component: Gallery,
  args: {
    images: [
      { src: "/assets/images/laboratorio-abc.jpeg", alt: "Instalaciones de laboratorio" },
      { src: "/assets/images/mision.png", alt: "Imagen institucional de misión" },
      { src: "/assets/images/vision.png", alt: "Imagen institucional de visión" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(720px, 90vw)" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
const ThreePhotos = {};
export { ThreePhotos };
const OnePhoto = {
  args: {
    images: [{ src: "/assets/images/laboratorio-abc.jpeg", alt: "Instalaciones de laboratorio" }],
  },
};
export { OnePhoto };
const Empty = { args: { images: [] } };
export { Empty };
const WithoutPhoto = {
  args: {
    images: [
      {
        src: "/assets/respaldos/quimica.svg",
        alt: "Sin fotografía disponible. Ilustración de Química.",
        tipo: "illustration",
      },
    ],
  },
};
export { WithoutPhoto };
