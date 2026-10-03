import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tarjeta } from "./Tarjeta";
import { laboratorio } from "./organismos.fixtures";

const meta = { title: "Organismos/Tarjeta", component: Tarjeta, parameters: { layout: "fullscreen" }, args: { laboratorio: { ...laboratorio, servicios: 2, equipos: 1 }, foto: laboratorio.galeria[0] }, decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>] } satisfies Meta<typeof Tarjeta>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
