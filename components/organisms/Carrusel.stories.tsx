import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Carrusel } from "./Carrusel";

const meta = { title: "Organismos/Carrusel", component: Carrusel, parameters: { layout: "fullscreen" }, args: { slides: ["laboratorio-abc.jpeg", "mision.png", "vision.png"].map((imagen, i) => ({ imagen: `/assets/images/${imagen}`, titulo: `Noticia de ejemplo ${i + 1}`, texto: "Contenido de demostración", href: "/laboratorios", enlace: "Ver laboratorios" })) } } satisfies Meta<typeof Carrusel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
