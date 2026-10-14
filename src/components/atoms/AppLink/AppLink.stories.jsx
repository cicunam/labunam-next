// LabUNAM
// Historias
// AppLink.stories (enlaces internos y externos del portal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import AppLink from "./AppLink";

// Configuración de la historia
const meta = {
  title: "Átomos/AppLink",
  component: AppLink,
  args: { href: "/laboratorios", children: "Ver laboratorios" },
};
export default meta;

// Historias
// Enlace a una ruta interna del portal
const Internal = {};
export { Internal };
// Enlace a un sitio externo abierto en otra pestaña
const External = {
  args: {
    href: "https://www.unam.mx/",
    children: "Universidad Nacional Autónoma de México",
    target: "_blank",
    rel: "noopener",
  },
};
export { External };
