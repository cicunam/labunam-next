import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "./SearchBar";

const meta = { title: "Organismos/SearchBar", component: SearchBar, parameters: { layout: "fullscreen" }, args: { titulo: "Encuentra el laboratorio que necesitas", sedes: [{ clave: "ciudad-de-mexico", etiqueta: "Ciudad de México", total: 3 }], sugerencias: ["Microscopía", "Microscopía óptica", "Rayos X"], frecuentes: ["Microscopía", "Rayos X"] } } satisfies Meta<typeof SearchBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
