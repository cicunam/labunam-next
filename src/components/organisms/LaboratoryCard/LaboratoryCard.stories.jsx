import LaboratoryCard from "./LaboratoryCard";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = {
  title: "Organismos/LaboratoryCard",
  component: LaboratoryCard,
  parameters: { layout: "fullscreen" },
  args: { laboratorio, photo: laboratorio.galeria[0] },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
const Default = {};
export { Default };
const WithoutPhoto = {
  args: {
    photo: {
      src: "/assets/respaldos/general.svg",
      alt: "Sin fotografía disponible. Ilustración general de laboratorio.",
      tipo: "illustration",
    },
  },
};
export { WithoutPhoto };
const Match = { args: { matches: ["Microscopio"] } };
export { Match };
const WithoutCapabilities = {
  args: { laboratorio: { ...laboratorio, servicios: [], equipos: [] } },
};
export { WithoutCapabilities };
