import { notFound } from "next/navigation";
import { getContactDetails } from "@/server/laboratorios/laboratoriosService";
import { Contact } from "@/components";

export const metadata = {
  title: "Contacto",
  description:
    "Consulta los canales de contacto de LabUNAM y la Coordinación de la Investigación Científica de la UNAM.",
};
const ContactPage = async ({ searchParams }) => {
  const { laboratorio } = await searchParams;
  if (laboratorio === undefined) {
    return <Contact />;
  }
  const lab = await getContactDetails(laboratorio);
  if (!lab) {
    notFound();
  }
  return <Contact laboratorio={lab} />;
};

export default ContactPage;
