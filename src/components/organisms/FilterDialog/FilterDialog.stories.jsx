import FilterDialog from "./FilterDialog";
import { filtros } from "@datosPrueba/componentes";
import DisciplineBar from "../DisciplineBar/DisciplineBar";

const meta = {
  title: "Organismos/FilterDialog",
  component: FilterDialog,
  parameters: { layout: "fullscreen" },
  args: { criteria: {}, filters: filtros, total: 3, children: <DisciplineBar criteria={{}} /> },
};
export default meta;
const Default = {};
export { Default };
