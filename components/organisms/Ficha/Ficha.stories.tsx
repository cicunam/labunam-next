import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Ficha } from "./Ficha";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = { title: "Organismos/Ficha", component: Ficha, parameters: { layout: "fullscreen" }, args: { cargar: async () => laboratorio }, render: (args) => <>{!args.inicial && <button data-ficha="1">Abrir ficha de demostración</button>}<Ficha {...args} /></> } satisfies Meta<typeof Ficha>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
export const ErrorDeCarga: Story = { args: { cargar: async () => { throw new Error("Fallo simulado"); } } };

export const Pagina: Story = { args: { inicial: laboratorio } };
