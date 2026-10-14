// LabUNAM
// Historias
// Gallery.stories (galería de imágenes de la ficha)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Gallery from "./Gallery";

// Configuración de la historia
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

// Historias
// Galería con tres fotografías
const ThreePhotos = {};
export { ThreePhotos };
// Galería con una sola fotografía
const OnePhoto = {
  args: {
    images: [{ src: "/assets/images/laboratorio-abc.jpeg", alt: "Instalaciones de laboratorio" }],
  },
};
export { OnePhoto };
// Galería sin imágenes
const Empty = { args: { images: [] } };
export { Empty };
// Galería con la ilustración de respaldo de un área
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
