// LabUNAM
// Historias
// LaboratoryDetails.stories (contenido de la ficha de laboratorio)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import LaboratoryDetails from "./LaboratoryDetails";

// Datos de prueba
import { laboratorio } from "@datosPrueba/componentes";

// Configuración de la historia
const meta = {
  title: "Organismos/LaboratoryDetails",
  component: LaboratoryDetails,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, margin: "auto" }}>
        <Story />
      </div>
    ),
  ],

  args: { laboratorio, isPage: true },
};
export default meta;

// Historias
// Ficha completa como página directa
const Default = {};
export { Default };
