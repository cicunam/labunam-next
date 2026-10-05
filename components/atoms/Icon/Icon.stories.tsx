import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "./Icon";

const meta = {
  title: "Átomos/Icon",
  component: Icon,
  args: { nombre: "biologia", etiqueta: "Biología" },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Biologia: Story = {};
export const Areas: Story = {
  render: () => <div style={{ display: "flex", flexWrap: "wrap", gap: 24, maxWidth: 600 }}>
    {(["todas", "biologia", "salud", "quimica", "fisica", "materiales", "computo", "tierra", "ingenieria", "sostenibilidad", "humanidades"] as const).map((nombre) => <Icon key={nombre} nombre={nombre} etiqueta={nombre} />)}
  </div>,
};
