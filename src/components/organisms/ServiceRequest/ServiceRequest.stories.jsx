import { ServiceRequest } from "./ServiceRequest";
import { catalogosEjemplo } from "@/lib/solicitudes/solicitudes.fixtures";
const meta = { title: "Organismos/ServiceRequest", component: ServiceRequest, args: { catalogos: catalogosEjemplo }, parameters: { layout: "fullscreen" } };
export default meta;
export const Principal = {};
export const ConLaboratorio = { args: { laboratorio: { idLab: 18, nombre: "Laboratorio de microscopía", entidad: "Instituto de investigación", sitio: "https://www.unam.mx/" } } };
