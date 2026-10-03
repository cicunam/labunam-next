import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TiraDisciplinas } from "./TiraDisciplinas";
import { ModalFiltros } from "./ModalFiltros";
import { filtros } from "./organismos.fixtures";

const meta = { title: "Organismos/TiraDisciplinas", component: TiraDisciplinas, parameters: { layout: "fullscreen" }, args: { criterios: { disciplina: "biologia" } }, decorators: [(Story) => <ModalFiltros criterios={{}} filtros={filtros} total={3}><Story /></ModalFiltros>] } satisfies Meta<typeof TiraDisciplinas>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
