// LabUNAM
// Historias
// Badge.stories (tonos de la insignia por red de laboratorios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Badge from "./Badge";

// Configuración de la historia
const meta = {
  title: "Átomos/Badge",
  component: Badge,
  args: { children: "Laboratorio nacional" },
};
export default meta;

// Historias
// Insignia roja de laboratorio nacional
export const Nacional = { args: { tone: "red", children: "Laboratorio nacional" } };
// Insignia azul de laboratorio universitario
export const Universitario = { args: { tone: "blue", children: "Laboratorio universitario" } };
// Insignia verde de unidad de apoyo
export const Unidad = { args: { tone: "green", children: "Unidad de apoyo" } };
// Insignia neutra de laboratorio internacional
export const Internacional = { args: { tone: "neutral", children: "Laboratorio internacional" } };
