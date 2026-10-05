import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LaboratoryCard } from "./LaboratoryCard";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = { title: "Organismos/LaboratoryCard", component: LaboratoryCard, parameters: { layout: "fullscreen" }, args: { laboratorio, foto: laboratorio.galeria[0] }, decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>] } satisfies Meta<typeof LaboratoryCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};

export const SinFotografia: Story = { args: { foto: { src: "/assets/respaldos/general.svg", alt: "Sin fotografía disponible. Ilustración general de laboratorio.", tipo: "ilustracion" } } };

export const Coincidencia: Story = { args: { coincidencias: ["Microscopio"] } };
export const SinCapacidades: Story = { args: { laboratorio: { ...laboratorio, servicios: [], equipos: [] } } };
