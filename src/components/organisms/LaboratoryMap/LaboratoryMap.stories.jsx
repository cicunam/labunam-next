import LaboratoryMap from "./LaboratoryMap";

const meta = {
  title: "Organismos/LaboratoryMap",
  component: LaboratoryMap,
  parameters: { layout: "fullscreen" },
};
export default meta;
const Default = {
  args: {
    locations: [
      { clave: "ciudad-de-mexico", total: 24 },
      { clave: "queretaro", total: 8 },
      { clave: "yucatan", total: 3 },
      { clave: "baja-california", total: 1 },
    ],
  },
};
export { Default };
const WithoutRecords = { args: { locations: [] } };
export { WithoutRecords };
