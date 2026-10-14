// LabUNAM
// Historias
// SearchField.stories (campo del buscador con texto o lista)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import SearchField from "./SearchField";
import Input from "../../atoms/Input/Input";

// Configuración de la historia
const meta = {
  title: "Moléculas/SearchField",
  component: SearchField,
  args: { label: "Qué buscas", controlId: "query", children: null },
  decorators: [
    (Story) => (
      <div style={{ width: "min(360px, 90vw)" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

// Historias
// Campo con entrada de texto integrada
const Text = {
  args: {
    children: (
      <Input
        integrated
        id="query"
        name="q"
        type="search"
        placeholder="Laboratorio, técnica o equipo"
      />
    ),
  },
};
export { Text };
// Campo con lista desplegable de redes
const Select = {
  args: {
    label: "Red",
    controlId: "network",
    children: (
      <select
        id="network"
        name="tipo"
      >
        <option value="">Todas las redes</option>
        <option value="nacionales">Nacionales</option>
      </select>
    ),
  },
};
export { Select };
