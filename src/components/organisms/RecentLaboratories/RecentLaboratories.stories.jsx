// LabUNAM
// Historias
// RecentLaboratories.stories (laboratorios recientes de la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import RecentLaboratories from "./RecentLaboratories";

// Configuración de la historia
const meta = {
  title: "Organismos/RecentLaboratories",
  component: RecentLaboratories,
  parameters: { layout: "fullscreen" },
};
export default meta;

// Historias
// Sección sin laboratorios recientes
const Default = { args: { recentLaboratorios: [], photos: {}, total: 0 } };
export { Default };
