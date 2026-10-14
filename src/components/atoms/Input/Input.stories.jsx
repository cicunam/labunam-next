// LabUNAM
// Historias
// Input.stories (estados del campo de texto)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Input from "./Input";

// Configuración de la historia
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

// Historias
// Campo vacío con texto de ayuda
const Empty = {};
export { Empty };
// Campo con un valor escrito
const WithValue = { args: { defaultValue: "Microscopía" } };
export { WithValue };
// Campo deshabilitado
const Disabled = { args: { disabled: true } };
export { Disabled };
// Campo inválido enlazado a su mensaje de error
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
