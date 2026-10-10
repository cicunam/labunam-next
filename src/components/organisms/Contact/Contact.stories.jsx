import Contact from "./Contact";

const meta = {
  title: "Organismos/Contact",
  component: Contact,
  parameters: { layout: "fullscreen" },
};
export default meta;
const Default = {};
export { Default };
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
