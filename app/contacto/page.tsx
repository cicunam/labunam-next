import { notFound } from "next/navigation";
import { cargarCatalogo } from "@/lib/catalogo/catalogo";
import { Contacto } from "@/components/organisms/Contacto/Contacto";
export const metadata = { title: "Contacto", description: "Consulta los canales de contacto de LabUNAM y la Coordinación de la Investigación Científica de la UNAM." };
export default async function PaginaContacto({ searchParams }: { searchParams: Promise<{ laboratorio?: string | string[] }> }) {
  const { laboratorio } = await searchParams;
  if (laboratorio === undefined) return <Contacto />;
  if (typeof laboratorio !== "string" || !/^[1-9]\d*$/.test(laboratorio)) notFound();
  const lab = (await cargarCatalogo()).laboratorios.find((item) => item.idLab === Number(laboratorio));
  if (!lab) notFound();
  return <Contacto laboratorio={{ idLab: lab.idLab, nombre: lab.nombre, entidad: lab.entidad, servicios: lab.servicios, sitio: lab.sitio }} />;
}
