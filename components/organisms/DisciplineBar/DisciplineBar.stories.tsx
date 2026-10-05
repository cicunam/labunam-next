import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DisciplineBar } from "./DisciplineBar";
import { FilterDialog } from "../FilterDialog/FilterDialog";
import { filtros } from "../fixtures/organismos.fixtures";

const meta = { title: "Organismos/DisciplineBar", component: DisciplineBar, parameters: { layout: "fullscreen" }, args: { criterios: { disciplina: "biologia" } }, decorators: [(Story) => <FilterDialog criterios={{}} filtros={filtros} total={3}><Story /></FilterDialog>] } satisfies Meta<typeof DisciplineBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
