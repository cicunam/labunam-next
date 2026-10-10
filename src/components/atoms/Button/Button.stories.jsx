import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
  title: "Átomos/Button",
  component: Button,
  // El contraste naranja/blanco es una excepción de imagen documentada en el plan.
  parameters: { a11y: { test: "todo" } },
  args: { children: "Buscar laboratorios", onClick: fn() },
  argTypes: { size: { control: "select", options: ["small", "medium", "large"] } },
};
export default meta;
const Small = { args: { size: "small" } };
export { Small };
const Medium = { args: { size: "medium" } };
export { Medium };
const Large = { args: { size: "large" } };
export { Large };
const Disabled = { args: { disabled: true } };
export { Disabled };
