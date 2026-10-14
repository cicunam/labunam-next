// LabUNAM
// Historias
// Contact.stories (formulario de solicitud de servicios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Contact from "./Contact";

// Configuración de la historia
const meta = {
  title: "Organismos/Contact",
  component: Contact,
  parameters: { layout: "fullscreen" },
};
export default meta;

// Historias
// Formulario general sin laboratorio elegido
const Default = {};
export { Default };
// Formulario de solicitud para un laboratorio concreto
const ServiceRequest = {
  args: {
    laboratorio: {
      idLab: 18,
      nombre: "Laboratorio de microscopía",
      entidad: "Instituto de investigación",
      servicios: ["Microscopía electrónica"],
      sitio: "https://www.unam.mx/",
    },
  },
};
export { ServiceRequest };
