import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Buscador } from "./Buscador";

const meta = { title: "Organismos/Buscador", component: Buscador, parameters: { layout: "fullscreen" }, args: { titulo: "Encuentra el laboratorio que necesitas", sedes: [{ clave: "ciudad-de-mexico", etiqueta: "Ciudad de México", total: 3 }], sugerencias: ["Microscopía", "Microscopía óptica", "Rayos X"], frecuentes: ["Microscopía", "Rayos X"] } } satisfies Meta<typeof Buscador>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
