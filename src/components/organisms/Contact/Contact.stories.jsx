import { Contact } from "./Contact";

const meta = {
  title: "Organismos/Contact",
  component: Contact,
  parameters: { layout: "fullscreen" },
};
export default meta;
export const Principal = {};
export const SolicitudServicio = {
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
