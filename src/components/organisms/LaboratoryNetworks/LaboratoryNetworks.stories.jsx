// LabUNAM
// Historias
// LaboratoryNetworks.stories (redes de laboratorios de la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import LaboratoryNetworks from "./LaboratoryNetworks";

// Configuración de la historia
const meta = {
  title: "Organismos/LaboratoryNetworks",
  component: LaboratoryNetworks,
  parameters: { layout: "fullscreen" },
};
export default meta;

// Historias
// Redes con el total de laboratorios de cada una
const Default = {
  args: { counts: { nacionales: 12, universitarios: 24, unidades: 36 } },
};
export { Default };
