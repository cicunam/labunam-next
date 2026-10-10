import LaboratoryDialog from "./LaboratoryDialog";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = {
  title: "Organismos/LaboratoryDialog",
  component: LaboratoryDialog,
  parameters: { layout: "fullscreen" },
  args: { loadDetails: async () => laboratorio },
  render: (args) => (
    <>
      {!args.inicial && <button data-ficha="1">Abrir ficha de demostración</button>}
      <LaboratoryDialog {...args} />
    </>
  ),
};
export default meta;
export const Principal = {};
export const ErrorDeCarga = {
  args: {
    loadDetails: async () => {
      throw new Error("Fallo simulado");
    },
  },
};
export const Pagina = { args: { inicial: laboratorio } };
