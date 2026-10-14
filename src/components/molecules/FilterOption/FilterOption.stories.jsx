// LabUNAM
// Historias
// FilterOption.stories (estados de la opción de filtro)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

// Componentes
import FilterOption from "./FilterOption";

// Configuración de la historia
const meta = {
  title: "Moléculas/FilterOption",
  component: FilterOption,
  args: {
    name: "sede",
    value: "sonora",
    label: "Sonora",
    total: 4,
    selected: false,
    onChange: fn(),
  },
};
export default meta;

// Historias
// Opción disponible sin seleccionar
const Available = {};
export { Available };
// Opción seleccionada
const Selected = { args: { selected: true } };
export { Selected };
// Opción sin resultados, que se muestra atenuada
const WithoutResults = { args: { total: 0 } };
export { WithoutResults };
// Opción seleccionada aunque ya no tenga resultados
const SelectedWithoutResults = { args: { total: 0, selected: true } };
export { SelectedWithoutResults };
// Grupo de opciones con selección real y prueba de clic
const Group = {
  // Grupo de radios controlado por estado local, como en el diálogo de filtros
  render: function OptionGroup() {
    const [value, setValue] = useState("");
    return (
      <fieldset style={{ border: 0 }}>
        <legend>Sede</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { valor: "", etiqueta: "Cualquiera", total: 12 },
            { valor: "sonora", etiqueta: "Sonora", total: 4 },
          ].map((option) => (
            <FilterOption
              key={option.valor}
              value={option.valor}
              label={option.etiqueta}
              total={option.total}
              name="sede"
              selected={value === option.valor}
              onChange={(event) => setValue(event.target.value)}
            />
          ))}
        </div>
      </fieldset>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: /Sonora/ }));
    await expect(canvas.getByRole("radio", { name: /Sonora/ })).toBeChecked();
  },
};
export { Group };
