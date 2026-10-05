import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pildora } from "./Pildora";

const meta = {
  title: "Átomos/Pildora",
  component: Pildora,
  args: { children: "Con certificación" },
} satisfies Meta<typeof Pildora>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Normal: Story = {};
export const Activa: Story = { args: { activa: true } };
