import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppLink } from "./AppLink";

const meta = {
  title: "Átomos/AppLink",
  component: AppLink,
  args: { href: "/laboratorios", children: "Ver laboratorios" },
} satisfies Meta<typeof AppLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interno: Story = {};
export const Externo: Story = { args: { href: "https://www.unam.mx/", children: "Universidad Nacional Autónoma de México", target: "_blank", rel: "noopener" } };
