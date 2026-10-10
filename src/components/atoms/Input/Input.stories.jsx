import Input from "./Input";

const meta = {
  title: "Átomos/Input",
  component: Input,
  args: { id: "example-input", placeholder: "Laboratorio, técnica o equipo" },
  decorators: [
    (Story) => (
      <div style={{ width: "min(300px, 80vw)" }}>
        <label htmlFor="example-input">Qué buscas</label>
        <Story />
      </div>
    ),
  ],
};
export default meta;
const Empty = {};
export { Empty };
const WithValue = { args: { defaultValue: "Microscopía" } };
export { WithValue };
const Disabled = { args: { disabled: true } };
export { Disabled };
const Invalid = {
  args: { "aria-invalid": true, "aria-describedby": "input-error" },
  render: (args) => (
    <div>
      <Input {...args} />
      <p id="input-error">Escribe un término de búsqueda.</p>
    </div>
  ),
};
export { Invalid };
