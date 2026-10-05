import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Contact } from "./Contact";
const meta = { title: "Organismos/Contact", component: Contact, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Contact>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};

export const SolicitudServicio: Story = { args: { laboratorio: { idLab: 18, nombre: "Laboratorio de microscopía", entidad: "Instituto de investigación", servicios: ["Microscopía electrónica"], sitio: "https://www.unam.mx/" } } };
