// LabUNAM
// Historias
// DisciplineBar.stories (barra de disciplinas del catálogo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import DisciplineBar from "./DisciplineBar";
import FilterDialog from "../FilterDialog/FilterDialog";

// Datos de prueba
import { filtros } from "@datosPrueba/componentes";

// Configuración de la historia
const meta = {
  title: "Organismos/DisciplineBar",
  component: DisciplineBar,
  parameters: { layout: "fullscreen" },
  args: { criteria: { disciplina: "biologia" } },
  decorators: [
    (Story) => (
      <FilterDialog
        criteria={{}}
        filters={filtros}
        total={3}
      >
        <Story />
      </FilterDialog>
    ),
  ],
};
export default meta;

// Historias
// Barra con Biología seleccionada dentro del diálogo de filtros
const Default = {};
export { Default };
