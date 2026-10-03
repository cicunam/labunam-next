import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Campo } from "./Campo";

const meta = {
  title: "Átomos/Campo",
  component: Campo,
  args: { id: "campo-ejemplo", placeholder: "Laboratorio, técnica o equipo" },
  decorators: [(Story) => <div style={{ width: "min(300px, 80vw)" }}><label htmlFor="campo-ejemplo">Qué buscas</label><Story /></div>],
} satisfies Meta<typeof Campo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Vacio: Story = {};
export const ConValor: Story = { args: { defaultValue: "Microscopía" } };
export const Deshabilitado: Story = { args: { disabled: true } };
export const Invalido: Story = { args: { "aria-invalid": true, "aria-describedby": "error-campo" }, render: (args) => <div><Campo {...args} /><p id="error-campo">Escribe un término de búsqueda.</p></div> };
