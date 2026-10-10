import LaboratoryNetworks from "./LaboratoryNetworks";

const meta = {
  title: "Organismos/LaboratoryNetworks",
  component: LaboratoryNetworks,
  parameters: { layout: "fullscreen" },
};
export default meta;
const Default = {
  args: { counts: { nacionales: 12, universitarios: 24, unidades: 36 } },
};
export { Default };
