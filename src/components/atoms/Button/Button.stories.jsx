// LabUNAM
// Historias
// Button.stories (tamaños y estado deshabilitado del botón)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { fn } from "storybook/test";

// Componentes
import Button from "./Button";

// Configuración de la historia
const meta = {
  title: "Átomos/Button",
  component: Button,
  // El contraste naranja/blanco es una excepción de imagen documentada en el plan.
  parameters: { a11y: { test: "todo" } },
  args: { children: "Buscar laboratorios", onClick: fn() },
  argTypes: { size: { control: "select", options: ["small", "medium", "large"] } },
};
export default meta;

// Historias
// Botón pequeño
const Small = { args: { size: "small" } };
export { Small };
// Botón mediano
const Medium = { args: { size: "medium" } };
export { Medium };
// Botón grande
const Large = { args: { size: "large" } };
export { Large };
// Botón deshabilitado
const Disabled = { args: { disabled: true } };
export { Disabled };
