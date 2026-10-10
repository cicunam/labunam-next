import { grupos } from "@/lib/grupos/grupos";
import DisciplineSection from "./DisciplineSection";

const meta = {
  title: "Organismos/DisciplineSection",
  component: DisciplineSection,
  parameters: { layout: "fullscreen" },
};
export default meta;
export const Principal = {
  args: { areas: Object.fromEntries(grupos.map((grupo, index) => [grupo.clave, index + 1])) },
};
