import { FilterDialog } from "./FilterDialog";
import { filtros } from "../fixtures/organismos.fixtures";
import { DisciplineBar } from "../DisciplineBar/DisciplineBar";

const meta = {
  title: "Organismos/FilterDialog",
  component: FilterDialog,
  parameters: { layout: "fullscreen" },
  args: { criterios: {}, filtros, total: 3, children: <DisciplineBar criterios={{}} /> },
};
export default meta;
export const Principal = {};
