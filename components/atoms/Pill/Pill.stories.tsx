import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pill } from "./Pill";

const meta = {
  title: "Átomos/Pill",
  component: Pill,
  args: { children: "Con certificación" },
} satisfies Meta<typeof Pill>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Normal: Story = {};
export const Activa: Story = { args: { activa: true } };
