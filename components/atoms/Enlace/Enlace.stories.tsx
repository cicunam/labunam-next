import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Enlace } from "./Enlace";

const meta = {
  title: "Átomos/Enlace",
  component: Enlace,
  args: { href: "/laboratorios", children: "Ver laboratorios" },
} satisfies Meta<typeof Enlace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interno: Story = {};
export const Externo: Story = { args: { href: "https://www.unam.mx/", children: "Universidad Nacional Autónoma de México", target: "_blank", rel: "noopener" } };
