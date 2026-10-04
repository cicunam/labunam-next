import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Contacto } from "./Contacto";
const meta = { title: "Organismos/Contacto", component: Contacto, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Contacto>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
