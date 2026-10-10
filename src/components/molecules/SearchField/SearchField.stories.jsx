import SearchField from "./SearchField";
import Input from "../../atoms/Input/Input";

const meta = {
  title: "Moléculas/SearchField",
  component: SearchField,
  args: { etiqueta: "Qué buscas", controlId: "consulta", children: null },
  decorators: [
    (Story) => (
      <div style={{ width: "min(360px, 90vw)" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
export const Texto = {
  args: {
    children: (
      <Input
        integrado
        id="consulta"
        name="q"
        type="search"
        placeholder="Laboratorio, técnica o equipo"
      />
    ),
  },
};
export const Selector = {
  args: {
    etiqueta: "Red",
    controlId: "red",
    children: (
      <select
        id="red"
        name="tipo"
      >
        <option value="">Todas las redes</option>
        <option value="nacionales">Nacionales</option>
      </select>
    ),
  },
};
