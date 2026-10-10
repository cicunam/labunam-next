import { DisciplineBar } from "./DisciplineBar";
import { FilterDialog } from "../FilterDialog/FilterDialog";
import { filtros } from "../fixtures/organismos.fixtures";

const meta = {
  title: "Organismos/DisciplineBar",
  component: DisciplineBar,
  parameters: { layout: "fullscreen" },
  args: { criterios: { disciplina: "biologia" } },
  decorators: [
    (Story) => (
      <FilterDialog
        criterios={{}}
        filtros={filtros}
        total={3}
      >
        <Story />
      </FilterDialog>
    ),
  ],
};
export default meta;
export const Principal = {};
