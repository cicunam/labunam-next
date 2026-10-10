import SearchField from "./SearchField";
import Input from "../../atoms/Input/Input";

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
