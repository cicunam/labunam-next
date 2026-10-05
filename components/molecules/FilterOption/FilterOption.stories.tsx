import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilterOption } from "./FilterOption";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
const meta = {
  title: "Moléculas/FilterOption",
  component: FilterOption,
  args: { nombre: "sede", valor: "sonora", etiqueta: "Sonora", total: 4, seleccionada: false, onChange: fn() },
} satisfies Meta<typeof FilterOption>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Disponible: Story = {};
export const Seleccionada: Story = { args: { seleccionada: true } };
export const SinResultados: Story = { args: { total: 0 } };
export const SeleccionadaSinResultados: Story = { args: { total: 0, seleccionada: true } };
export const Grupo: Story = {
  render: function OptionGroup() {
    const [valor, setValue] = useState("");
    return <fieldset style={{ border: 0 }}><legend>Sede</legend><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {[{ valor: "", etiqueta: "Cualquiera", total: 12 }, { valor: "sonora", etiqueta: "Sonora", total: 4 }].map((opcion) => <FilterOption key={opcion.valor} {...opcion} nombre="sede" seleccionada={valor === opcion.valor} onChange={(event) => setValue(event.target.value)} />)}
    </div></fieldset>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: /Sonora/ }));
    await expect(canvas.getByRole("radio", { name: /Sonora/ })).toBeChecked();
  },
};
