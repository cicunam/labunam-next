import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Institucional } from "./Institucional";

const meta = { title: "Organismos/Institucional", component: Institucional, parameters: { layout: "fullscreen" },  } satisfies Meta<typeof Institucional>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
