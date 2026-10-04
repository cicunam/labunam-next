import { notFound } from "next/navigation";
import { cargarCatalogo } from "@/lib/catalogo";
import { fotosDe, leerFotos } from "@/lib/fotos";
import { Ficha } from "@/components/organisms/Ficha";
import { Enlace } from "@/components/atoms/Enlace";

import styles from "../../Laboratorio.module.css";

export const dynamic = "force-dynamic";
async function buscar(id: string) {
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const lab = (await cargarCatalogo()).laboratorios.find((lab) => lab.idLab === Number(id));
  if (!lab) notFound();
  return lab;
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const lab = await buscar((await params).id);
  return { title: lab.nombre, description: `${lab.nombre}. ${lab.entidad}. ${lab.sedeNombre}. Consulta sus servicios, equipamiento y ubicación.` };
}
export default async function Laboratorio({ params }: { params: Promise<{ id: string }> }) {
  const lab = await buscar((await params).id);
  const { idLab, nombre, tipo, entidad, sedeNombre, ubicacion, mapa, servicios, equipos, distinciones, sitio } = lab;
  return <div className={`contenido ${styles.detalle}`}>
    <Enlace href="/laboratorios">← Volver al catálogo</Enlace>
    <Ficha key={idLab} inicial={{ idLab, nombre, tipo, entidad, sedeNombre, ubicacion, mapa, servicios, equipos, distinciones, sitio, galeria: fotosDe(idLab, await leerFotos()) }} />
  </div>;
}
