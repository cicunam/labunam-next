import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LaboratoryDetails } from "./LaboratoryDetails";
import { laboratorio } from "../fixtures/organismos.fixtures";
const meta = { title: "Organismos/LaboratoryDetails", component: LaboratoryDetails, parameters: { layout: "fullscreen" }, decorators: [(Story) => <div style={{ maxWidth: 960, margin: "auto" }}><Story /></div>], args: { laboratorio, pagina: true } } satisfies Meta<typeof LaboratoryDetails>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
