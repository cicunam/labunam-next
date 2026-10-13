import { OrganizationFields } from "./OrganizationFields";
import { catalogosEjemplo } from "@/lib/solicitudes/solicitudes.fixtures";
const meta = {
    title: "Organismos/OrganizationFields",
    component: OrganizationFields,
    args: { catalogos: catalogosEjemplo },
    decorators: [(Story) => <form style={{ width: "min(720px, 92vw)" }}><Story /></form>],
};
export default meta;
export const Principal = {};
