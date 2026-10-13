import { ServiceRequestForm } from "./ServiceRequestForm";
import { catalogosEjemplo } from "@/lib/solicitudes/solicitudes.fixtures";
const meta = {
    title: "Organismos/ServiceRequestForm",
    component: ServiceRequestForm,
    args: { catalogos: catalogosEjemplo },
    decorators: [(Story) => <div style={{ width: "min(760px, 92vw)" }}><Story /></div>],
};
export default meta;
export const Principal = {};
export const ConLaboratorio = { args: { laboratorio: { idLab: 18 } } };
