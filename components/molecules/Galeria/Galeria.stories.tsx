import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Galeria } from "./Galeria";

const meta = {
  title: "Moléculas/Galeria",
  component: Galeria,
  args: { imagenes: [
    { src: "/assets/images/laboratorio-abc.jpeg", alt: "Instalaciones de laboratorio" },
    { src: "/assets/images/mision.png", alt: "Imagen institucional de misión" },
    { src: "/assets/images/vision.png", alt: "Imagen institucional de visión" },
  ] },
  decorators: [(Story) => <div style={{ width: "min(720px, 90vw)" }}><Story /></div>],
} satisfies Meta<typeof Galeria>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TresFotos: Story = {};
export const UnaFoto: Story = { args: { imagenes: [{ src: "/assets/images/laboratorio-abc.jpeg", alt: "Instalaciones de laboratorio" }] } };
export const Vacia: Story = { args: { imagenes: [] } };

export const SinFotografia: Story = { args: { imagenes: [{ src: "/assets/respaldos/quimica.svg", alt: "Sin fotografía disponible. Ilustración de Química.", tipo: "ilustracion" }] } };
