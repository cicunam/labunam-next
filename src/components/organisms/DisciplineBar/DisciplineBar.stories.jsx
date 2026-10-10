import DisciplineBar from "./DisciplineBar";
import FilterDialog from "../FilterDialog/FilterDialog";
import { filtros } from "../fixtures/organismos.fixtures";

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
const Default = {};
export { Default };
