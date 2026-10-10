import Pill from "./Pill";

const meta = {
  title: "Átomos/Pill",
  component: Pill,
  args: { children: "Con certificación" },
};
export default meta;
export const Normal = {};
const Active = { args: { active: true } };
export { Active };
