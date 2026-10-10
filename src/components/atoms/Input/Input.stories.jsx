import { Input } from "./Input";

const meta = {
  title: "Átomos/Input",
  component: Input,
  args: { id: "campo-ejemplo", placeholder: "Laboratorio, técnica o equipo" },
  decorators: [
    (Story) => (
      <div style={{ width: "min(300px, 80vw)" }}>
        <label htmlFor="campo-ejemplo">Qué buscas</label>
        <Story />
      </div>
    ),
  ],
};
export default meta;
export const Vacio = {};
export const ConValor = { args: { defaultValue: "Microscopía" } };
export const Deshabilitado = { args: { disabled: true } };
export const Invalido = {
  args: { "aria-invalid": true, "aria-describedby": "error-campo" },
  render: (args) => (
    <div>
      <Input {...args} />
      <p id="error-campo">Escribe un término de búsqueda.</p>
    </div>
  ),
};
