import { Gallery } from "./Gallery";

const meta = {
  title: "Moléculas/Gallery",
  component: Gallery,
  args: {
    imagenes: [
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
export const TresFotos = {};
export const UnaFoto = {
  args: {
    imagenes: [{ src: "/assets/images/laboratorio-abc.jpeg", alt: "Instalaciones de laboratorio" }],
  },
};
export const Vacia = { args: { imagenes: [] } };
export const SinFotografia = {
  args: {
    imagenes: [
      {
        src: "/assets/respaldos/quimica.svg",
        alt: "Sin fotografía disponible. Ilustración de Química.",
        tipo: "ilustracion",
      },
    ],
  },
};
