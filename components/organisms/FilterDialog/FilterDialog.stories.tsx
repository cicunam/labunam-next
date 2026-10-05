import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilterDialog } from "./FilterDialog";
import { filtros } from "../fixtures/organismos.fixtures";
import { DisciplineBar } from "../DisciplineBar/DisciplineBar";

const meta = { title: "Organismos/FilterDialog", component: FilterDialog, parameters: { layout: "fullscreen" }, args: { criterios: {}, filtros, total: 3, children: <DisciplineBar criterios={{}} /> } } satisfies Meta<typeof FilterDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
