import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { Contact } from "@/components/organisms/Contact/Contact";

export const metadata = {
  title: "Contacto",
  description:
    "Consulta los canales de contacto de LabUNAM y la Coordinación de la Investigación Científica de la UNAM.",
};
export default async function ContactPage({ searchParams }) {
  const { laboratorio } = await searchParams;
  if (laboratorio === undefined) {
    return <Contact />;
  }
  if (typeof laboratorio !== "string" || !/^[1-9]\d*$/.test(laboratorio)) {
    notFound();
  }
  const lab = (await loadCatalog()).laboratorios.find((item) => item.idLab === Number(laboratorio));
  if (!lab) {
    notFound();
  }
  return (
    <Contact
      laboratorio={{
        idLab: lab.idLab,
        nombre: lab.nombre,
        entidad: lab.entidad,
        servicios: lab.servicios,
        sitio: lab.sitio,
      }}
    />
  );
}
