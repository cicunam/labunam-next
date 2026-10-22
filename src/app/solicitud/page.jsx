// LabUNAM
// Páginas
// Solicitud (/solicitud)
// Ángelo M

// Dependencias
import { notFound } from "next/navigation";

// Servicios
import { getContactDetails, isValidId } from "@/server/laboratorios/laboratoriosService";
import { loadRequestCatalogs } from "@/server/solicitudes/solicitudesCatalogo";

// Componentes
import { ServiceRequest } from "@/components";

// Configuración de Next
export const metadata = {
  title: "Solicitud",
  description: "Solicita un servicio a los laboratorios de la UNAM a través de LabUNAM.",
};

// Definición de la página
const ServiceRequestPage = async ({
  searchParams, // Promise - Resuelve al objeto con los parámetros de la URL; laboratorio es el id del laboratorio asociado
}) => {
  // Datos
  // Sin laboratorio se muestra la solicitud general; con un id inválido o inexistente, la página 404.
  const { laboratorio } = await searchParams;
  if (laboratorio !== undefined && !isValidId(laboratorio)) {
    notFound();
  }
  const [{ publicos }, lab] = await Promise.all([
    loadRequestCatalogs(),
    laboratorio === undefined ? null : getContactDetails(laboratorio),
  ]);
  if (laboratorio !== undefined && !lab) {
    notFound();
  }

  // Al navegador sólo viajan los campos que muestra «Laboratorio de interés».
  const selected = lab && { idLab: lab.idLab, nombre: lab.nombre, entidad: lab.entidad };

  // Interfaz
  return (
    <ServiceRequest
      catalogos={publicos}
      laboratorio={selected}
    />
  );
};

export default ServiceRequestPage;
