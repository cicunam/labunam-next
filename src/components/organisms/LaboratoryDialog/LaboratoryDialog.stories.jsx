// LabUNAM
// Historias
// LaboratoryDialog.stories (modal de ficha de laboratorio)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import LaboratoryDialog from "./LaboratoryDialog";

// Datos de prueba
import { laboratorio } from "@datosPrueba/componentes";

// Configuración de la historia
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

// Historias
// Modal cerrado con un botón que abre la ficha
const Default = {};
export { Default };
// Modal que muestra el error cuando falla la carga de la ficha
const LoadingError = {
  args: {
    loadDetails: async () => {
      throw new Error("Fallo simulado");
    },
  },
};
export { LoadingError };
// Ficha abierta desde el inicio, como al recargar su URL
const Page = { args: { initialLaboratorio: laboratorio } };
export { Page };
