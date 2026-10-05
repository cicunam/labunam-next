import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LaboratoryDialog } from "./LaboratoryDialog";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = { title: "Organismos/LaboratoryDialog", component: LaboratoryDialog, parameters: { layout: "fullscreen" }, args: { loadDetails: async () => laboratorio }, render: (args) => <>{!args.inicial && <button data-ficha="1">Abrir ficha de demostración</button>}<LaboratoryDialog {...args} /></> } satisfies Meta<typeof LaboratoryDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
export const ErrorDeCarga: Story = { args: { loadDetails: async () => { throw new Error("Fallo simulado"); } } };

export const Pagina: Story = { args: { inicial: laboratorio } };
