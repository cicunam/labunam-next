import LaboratoryMap from "./LaboratoryMap";

const meta = {
  title: "Organismos/LaboratoryMap",
  component: LaboratoryMap,
  parameters: { layout: "fullscreen" },
};
export default meta;
export const Principal = {
  args: {
    sedes: [
      { clave: "ciudad-de-mexico", total: 24 },
      { clave: "queretaro", total: 8 },
      { clave: "yucatan", total: 3 },
      { clave: "baja-california", total: 1 },
    ],
  },
};
export const SinRegistros = { args: { sedes: [] } };
