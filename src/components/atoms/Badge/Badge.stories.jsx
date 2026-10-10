import Badge from "./Badge";

const meta = {
  title: "Átomos/Badge",
  component: Badge,
  args: { children: "Laboratorio nacional" },
};
export default meta;
export const Nacional = { args: { tone: "red", children: "Laboratorio nacional" } };
export const Universitario = { args: { tone: "blue", children: "Laboratorio universitario" } };
export const Unidad = { args: { tone: "green", children: "Unidad de apoyo" } };
export const Internacional = { args: { tone: "neutral", children: "Laboratorio internacional" } };
