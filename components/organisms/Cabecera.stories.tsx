import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cabecera } from "./Cabecera";

const meta = { title: "Organismos/Cabecera", component: Cabecera, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Cabecera>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
