import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { About } from "./About";

const meta = { title: "Organismos/About", component: About, parameters: { layout: "fullscreen" },  } satisfies Meta<typeof About>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
