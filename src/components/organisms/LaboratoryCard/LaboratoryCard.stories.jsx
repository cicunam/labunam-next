// LabUNAM
// Historias
// LaboratoryCard.stories (estados de la tarjeta de laboratorio)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import LaboratoryCard from "./LaboratoryCard";

// Datos de prueba
import { laboratorio } from "@datosPrueba/componentes";

// Configuración de la historia
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

// Historias
// Tarjeta con fotografía y sede
const Default = {};
export { Default };
// Tarjeta con la ilustración general de respaldo
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
// Tarjeta que muestra el equipo que coincide con la búsqueda
const Match = { args: { matches: ["Microscopio"] } };
export { Match };
// Tarjeta de un laboratorio sin servicios ni equipos
const WithoutCapabilities = {
  args: { laboratorio: { ...laboratorio, servicios: [], equipos: [] } },
};
export { WithoutCapabilities };
