import { AnalysisFields } from "./AnalysisFields";
import { FormSection } from "../../molecules/FormSection/FormSection";
import { catalogosEjemplo } from "@/lib/solicitudes/solicitudes.fixtures";
const meta = {
    title: "Organismos/AnalysisFields",
    component: AnalysisFields,
    args: { catalogos: catalogosEjemplo },
    decorators: [(Story) => <form style={{ width: "min(720px, 92vw)" }}><FormSection titulo="Análisis o prueba"><Story /></FormSection></form>],
};
export default meta;
export const Principal = {};
