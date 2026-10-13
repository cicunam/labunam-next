import { InstitutionFields } from "./InstitutionFields";
import { FormSection } from "../../molecules/FormSection/FormSection";
import { catalogosEjemplo } from "@/lib/solicitudes/solicitudes.fixtures";
import { searchInstitutions } from "@/lib/instituciones/instituciones";
import { institucionesEjemplo } from "@/lib/instituciones/instituciones.fixtures";
// Storybook no tiene rutas API: la búsqueda se resuelve sobre instituciones ficticias.
const buscarInstituciones = async (texto) => searchInstitutions(institucionesEjemplo, texto);
const meta = {
    title: "Organismos/InstitutionFields",
    component: InstitutionFields,
    args: { catalogos: catalogosEjemplo, buscarInstituciones },
    decorators: [(Story) => <form style={{ width: "min(720px, 92vw)" }}><FormSection titulo="Institución"><Story /></FormSection></form>],
};
export default meta;
export const Principal = {};
