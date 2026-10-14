// LabUNAM
// Historias
// FilterDialog.stories (diálogo de filtros del catálogo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import FilterDialog from "./FilterDialog";
import DisciplineBar from "../DisciplineBar/DisciplineBar";

// Datos de prueba
import { filtros } from "@datosPrueba/componentes";

// Configuración de la historia
const meta = {
  title: "Organismos/FilterDialog",
  component: FilterDialog,
  parameters: { layout: "fullscreen" },
  args: { criteria: {}, filters: filtros, total: 3, children: <DisciplineBar criteria={{}} /> },
};
export default meta;

// Historias
// Diálogo sin criterios activos y con la barra de disciplinas
const Default = {};
export { Default };
