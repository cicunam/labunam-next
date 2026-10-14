// LabUNAM
// Historias
// LaboratoryMap.stories (mapa de laboratorios por estado)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import LaboratoryMap from "./LaboratoryMap";

// Configuración de la historia
const meta = {
  title: "Organismos/LaboratoryMap",
  component: LaboratoryMap,
  parameters: { layout: "fullscreen" },
};
export default meta;

// Historias
// Mapa con laboratorios en cuatro estados
const Default = {
  args: {
    locations: [
      { clave: "ciudad-de-mexico", total: 24 },
      { clave: "queretaro", total: 8 },
      { clave: "yucatan", total: 3 },
      { clave: "baja-california", total: 1 },
    ],
  },
};
export { Default };
// Mapa sin ubicaciones registradas
const WithoutRecords = { args: { locations: [] } };
export { WithoutRecords };
