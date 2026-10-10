import { Badge } from "./Badge";

const meta = {
  title: "Átomos/Badge",
  component: Badge,
  args: { children: "Laboratorio nacional" },
};
export default meta;
export const Nacional = { args: { tono: "rojo", children: "Laboratorio nacional" } };
export const Universitario = { args: { tono: "azul", children: "Laboratorio universitario" } };
export const Unidad = { args: { tono: "verde", children: "Unidad de apoyo" } };
export const Internacional = { args: { tono: "neutro", children: "Laboratorio internacional" } };
