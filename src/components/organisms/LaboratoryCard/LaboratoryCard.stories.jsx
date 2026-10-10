import LaboratoryCard from "./LaboratoryCard";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = {
  title: "Organismos/LaboratoryCard",
  component: LaboratoryCard,
  parameters: { layout: "fullscreen" },
  args: { laboratorio, foto: laboratorio.galeria[0] },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
export const Principal = {};
export const SinFotografia = {
  args: {
    foto: {
      src: "/assets/respaldos/general.svg",
      alt: "Sin fotografía disponible. Ilustración general de laboratorio.",
      tipo: "ilustracion",
    },
  },
};
export const Coincidencia = { args: { coincidencias: ["Microscopio"] } };
export const SinCapacidades = {
  args: { laboratorio: { ...laboratorio, servicios: [], equipos: [] } },
};
