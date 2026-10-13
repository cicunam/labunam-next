import { InstitutionFields } from "./InstitutionFields";
import { FormSection } from "../../molecules/FormSection/FormSection";
import { catalogosEjemplo } from "@/lib/solicitudes/solicitudes.fixtures";
const meta = {
    title: "Organismos/InstitutionFields",
    component: InstitutionFields,
    args: { catalogos: catalogosEjemplo },
    decorators: [(Story) => <form style={{ width: "min(720px, 92vw)" }}><FormSection titulo="Institución"><Story /></FormSection></form>],
};
export default meta;
export const Principal = {};
