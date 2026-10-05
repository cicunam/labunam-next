import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Átomos/Badge",
  component: Badge,
  args: { children: "Laboratorio nacional" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nacional: Story = { args: { tono: "rojo", children: "Laboratorio nacional" } };
export const Universitario: Story = { args: { tono: "azul", children: "Laboratorio universitario" } };
export const Unidad: Story = { args: { tono: "verde", children: "Unidad de apoyo" } };
export const Internacional: Story = { args: { tono: "neutro", children: "Laboratorio internacional" } };
