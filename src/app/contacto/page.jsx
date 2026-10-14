// LabUNAM
// Páginas
// Contacto (/contacto)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { notFound } from "next/navigation";

// Servicios
import { getContactDetails } from "@/server/laboratorios/laboratoriosService";

// Componentes
import { Contact } from "@/components";

// Configuración de Next
export const metadata = {
  title: "Contacto",
  description:
    "Consulta los canales de contacto de LabUNAM y la Coordinación de la Investigación Científica de la UNAM.",
};

// Definición de la página
const ContactPage = async ({
  searchParams, // Promise - Resuelve al objeto con los parámetros de la URL; laboratorio es el id del laboratorio solicitado
}) => {
  // Datos
  // Sin laboratorio se muestra el contacto general; con un id inexistente, la página 404.
  const { laboratorio } = await searchParams;
  if (laboratorio === undefined) {
    return <Contact />;
  }
  const lab = await getContactDetails(laboratorio);
  if (!lab) {
    notFound();
  }

  // Interfaz
  return <Contact laboratorio={lab} />;
};

export default ContactPage;
