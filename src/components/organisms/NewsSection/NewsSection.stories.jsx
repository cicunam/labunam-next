// LabUNAM
// Historias
// NewsSection.stories (sección de noticias de la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import NewsSection from "./NewsSection";

// Configuración de la historia
const meta = {
  title: "Organismos/NewsSection",
  component: NewsSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

// Historias
// Sección con las noticias de ejemplo predeterminadas
const Default = { args: {} };
export { Default };
