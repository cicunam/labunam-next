// LabUNAM
// Historias
// DisciplineSection.stories (áreas de conocimiento de la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { grupos } from "@/lib/grupos/grupos";

// Componentes
import DisciplineSection from "./DisciplineSection";

// Configuración de la historia
const meta = {
  title: "Organismos/DisciplineSection",
  component: DisciplineSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

// Historias
// Sección con un total distinto de laboratorios por área
const Default = {
  args: { areaCounts: Object.fromEntries(grupos.map((grupo, index) => [grupo.clave, index + 1])) },
};
export { Default };
