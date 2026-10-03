import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentoBuscador } from "./SegmentoBuscador";
import { Campo } from "../atoms/Campo";
const meta = {
  title: "Moléculas/SegmentoBuscador",
  component: SegmentoBuscador,
  args: { etiqueta: "Qué buscas", controlId: "consulta", children: null },
  decorators: [(Story) => <div style={{ width: "min(360px, 90vw)" }}><Story /></div>],
} satisfies Meta<typeof SegmentoBuscador>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Texto: Story = { args: { children: <Campo integrado id="consulta" name="q" type="search" placeholder="Laboratorio, técnica o equipo" /> } };
export const Selector: Story = { args: { etiqueta: "Red", controlId: "red", children: <select id="red" name="tipo"><option value="">Todas las redes</option><option value="nacionales">Nacionales</option></select> } };
