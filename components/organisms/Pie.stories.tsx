import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pie } from "./Pie";

const meta = { title: "Organismos/Pie", component: Pie, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Pie>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
