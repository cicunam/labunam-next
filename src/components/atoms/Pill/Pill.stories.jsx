// LabUNAM
// Historias
// Pill.stories (estados de la píldora de filtro)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Pill from "./Pill";

// Configuración de la historia
const meta = {
  title: "Átomos/Pill",
  component: Pill,
  args: { children: "Con certificación" },
};
export default meta;

// Historias
// Píldora sin seleccionar
export const Normal = {};
// Píldora activa
const Active = { args: { active: true } };
export { Active };
