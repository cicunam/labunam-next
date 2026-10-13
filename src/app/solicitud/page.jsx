import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { loadRequestCatalogs } from "@/lib/catalogosSolicitud/catalogosSolicitud";
import { ServiceRequest } from "@/components/organisms/ServiceRequest/ServiceRequest";
export const metadata = { title: "Solicitud", description: "Solicita un servicio a los laboratorios de la UNAM a través de LabUNAM." };
export default async function ServiceRequestPage({ searchParams }) {
    const { laboratorio } = await searchParams;
    if (laboratorio !== undefined && (typeof laboratorio !== "string" || !/^[1-9]\d*$/.test(laboratorio)))
        notFound();
    const [{ publicos }, catalogo] = await Promise.all([loadRequestCatalogs(), laboratorio ? loadCatalog() : null]);
    if (!catalogo)
        return <ServiceRequest catalogos={publicos}/>;
    const lab = catalogo.laboratorios.find((item) => item.idLab === Number(laboratorio));
    if (!lab)
        notFound();
    // Sólo se envían al cliente los campos públicos que la sección necesita.
    return <ServiceRequest catalogos={publicos} laboratorio={{ idLab: lab.idLab, nombre: lab.nombre, entidad: lab.entidad, sitio: lab.sitio }}/>;
}
