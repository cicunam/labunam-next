// LabUNAM
// Historias
// ActiveChip.stories (chips de criterios activos del catálogo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import ActiveChip from "./ActiveChip";

// Configuración de la historia
const meta = {
  title: "Moléculas/ActiveChip",
  component: ActiveChip,
  args: { href: "/laboratorios", label: "Búsqueda", value: "rayos x" },
};
export default meta;

// Historias
// Chip de un texto buscado
const Search = {};
export { Search };
// Chip de una sede seleccionada
export const Sede = { args: { label: "Sede", value: "Ciudad de México" } };
