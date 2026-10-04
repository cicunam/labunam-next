import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DetalleFicha } from "./DetalleFicha";
import { laboratorio } from "./organismos.fixtures";
const meta = { title: "Organismos/DetalleFicha", component: DetalleFicha, parameters: { layout: "fullscreen" }, decorators: [(Story) => <div style={{ maxWidth: 960, margin: "auto" }}><Story /></div>], args: { laboratorio, pagina: true } } satisfies Meta<typeof DetalleFicha>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
