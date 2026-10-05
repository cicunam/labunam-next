import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Carousel } from "./Carousel";

const meta = { title: "Organismos/Carousel", component: Carousel, parameters: { layout: "fullscreen" }, args: { slides: ["laboratorio-abc.jpeg", "mision.png", "vision.png"].map((imagen, i) => ({ imagen: `/assets/images/${imagen}`, titulo: `Noticia de ejemplo ${i + 1}`, texto: "Contenido de demostración", href: "/laboratorios", enlace: "Ver laboratorios" })) } } satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
