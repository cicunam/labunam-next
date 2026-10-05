import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChipActivo } from "./ChipActivo";

const meta = {
  title: "Moléculas/ChipActivo",
  component: ChipActivo,
  args: { href: "/laboratorios", etiqueta: "Búsqueda", valor: "rayos x" },
} satisfies Meta<typeof ChipActivo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Busqueda: Story = {};
export const Sede: Story = { args: { etiqueta: "Sede", valor: "Ciudad de México" } };
