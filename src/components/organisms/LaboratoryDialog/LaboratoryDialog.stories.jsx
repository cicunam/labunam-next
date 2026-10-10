import LaboratoryDialog from "./LaboratoryDialog";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = {
  title: "Organismos/LaboratoryDialog",
  component: LaboratoryDialog,
  parameters: { layout: "fullscreen" },
  args: { loadDetails: async () => laboratorio },
  render: (args) => (
    <>
      {!args.initialLaboratorio && <button data-details="1">Abrir ficha de demostración</button>}
      <LaboratoryDialog {...args} />
    </>
  ),
};
export default meta;
const Default = {};
export { Default };
const LoadingError = {
  args: {
    loadDetails: async () => {
      throw new Error("Fallo simulado");
    },
  },
};
export { LoadingError };
const Page = { args: { initialLaboratorio: laboratorio } };
export { Page };
