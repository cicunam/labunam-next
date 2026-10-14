// LabUNAM
// Historias
// SearchBar.stories (buscador principal con sugerencias)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import SearchBar from "./SearchBar";

// Configuración de la historia
const meta = {
  title: "Organismos/SearchBar",
  component: SearchBar,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Encuentra el laboratorio que necesitas",
    locations: [{ clave: "ciudad-de-mexico", etiqueta: "Ciudad de México", total: 3 }],
    suggestions: ["Microscopía", "Microscopía óptica", "Rayos X"],
    popularSearches: ["Microscopía", "Rayos X"],
  },
};
export default meta;

// Historias
// Buscador con sede, sugerencias y búsquedas frecuentes
const Default = {};
export { Default };
