import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Boton } from "./Boton";

const meta = {
  title: "Átomos/Boton",
  component: Boton,
  // El contraste naranja/blanco es una excepción de imagen documentada en el plan.
  parameters: { a11y: { test: "todo" } },
  args: { children: "Buscar laboratorios", onClick: fn() },
  argTypes: { tamano: { control: "select", options: ["pequeno", "mediano", "grande"] } },
} satisfies Meta<typeof Boton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Pequeno: Story = { args: { tamano: "pequeno" } };
export const Mediano: Story = { args: { tamano: "mediano" } };
export const Grande: Story = { args: { tamano: "grande" } };
export const Deshabilitado: Story = { args: { disabled: true } };
