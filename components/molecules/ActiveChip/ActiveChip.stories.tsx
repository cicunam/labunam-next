import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActiveChip } from "./ActiveChip";

const meta = {
  title: "Moléculas/ActiveChip",
  component: ActiveChip,
  args: { href: "/laboratorios", etiqueta: "Búsqueda", valor: "rayos x" },
} satisfies Meta<typeof ActiveChip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Busqueda: Story = {};
export const Sede: Story = { args: { etiqueta: "Sede", valor: "Ciudad de México" } };
