import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { ServiceRequest } from "@/components/organisms/ServiceRequest/ServiceRequest";
export const metadata = { title: "Solicitud", description: "Solicita un servicio a los laboratorios de la UNAM a través de LabUNAM." };
export default async function ServiceRequestPage({ searchParams }) {
    const { laboratorio } = await searchParams;
    if (laboratorio === undefined)
        return <ServiceRequest />;
    if (typeof laboratorio !== "string" || !/^[1-9]\d*$/.test(laboratorio))
        notFound();
    const lab = (await loadCatalog()).laboratorios.find((item) => item.idLab === Number(laboratorio));
    if (!lab)
        notFound();
    // Sólo se envían al cliente los campos públicos que la sección necesita.
    return <ServiceRequest laboratorio={{ idLab: lab.idLab, nombre: lab.nombre, entidad: lab.entidad, sitio: lab.sitio }}/>;
}
