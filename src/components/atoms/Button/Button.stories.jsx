import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
  title: "Átomos/Button",
  component: Button,
  // El contraste naranja/blanco es una excepción de imagen documentada en el plan.
  parameters: { a11y: { test: "todo" } },
  args: { children: "Buscar laboratorios", onClick: fn() },
  argTypes: { tamano: { control: "select", options: ["pequeno", "mediano", "grande"] } },
};
export default meta;
export const Pequeno = { args: { tamano: "pequeno" } };
export const Mediano = { args: { tamano: "mediano" } };
export const Grande = { args: { tamano: "grande" } };
export const Deshabilitado = { args: { disabled: true } };
