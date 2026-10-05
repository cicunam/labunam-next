import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModalFiltros } from "./ModalFiltros";
import { filtros } from "../fixtures/organismos.fixtures";
import { TiraDisciplinas } from "../TiraDisciplinas/TiraDisciplinas";

const meta = { title: "Organismos/ModalFiltros", component: ModalFiltros, parameters: { layout: "fullscreen" }, args: { criterios: {}, filtros, total: 3, children: <TiraDisciplinas criterios={{}} /> } } satisfies Meta<typeof ModalFiltros>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
