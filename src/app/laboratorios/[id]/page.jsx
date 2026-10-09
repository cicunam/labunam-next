import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { getPhotos, readPhotos } from "@/lib/fotos/fotos";
import { LaboratoryDialog } from "@/components/organisms/LaboratoryDialog/LaboratoryDialog";
import { AppLink } from "@/components/atoms/AppLink/AppLink";
import styles from "./Laboratorio.module.css";
export const dynamic = "force-dynamic";
async function findLaboratorio(id) {
    if (!/^[1-9]\d*$/.test(id))
        notFound();
    const lab = (await loadCatalog()).laboratorios.find((lab) => lab.idLab === Number(id));
    if (!lab)
        notFound();
    return lab;
}
export async function generateMetadata({ params }) {
    const lab = await findLaboratorio((await params).id);
    return { title: lab.nombre, description: `${lab.nombre}. ${lab.entidad}. ${lab.sedeNombre}. Consulta sus servicios, equipamiento y ubicación.` };
}
export default async function LaboratoryPage({ params }) {
    const lab = await findLaboratorio((await params).id);
    const { idLab, nombre, tipo, entidad, sedeNombre, ubicacion, mapa, servicios, equipos, distinciones, sitio } = lab;
    return <div className={`contenido ${styles.detalle}`}>
    <AppLink href="/laboratorios">← Volver al catálogo</AppLink>
    <LaboratoryDialog key={idLab} inicial={{ idLab, nombre, tipo, entidad, sedeNombre, ubicacion, mapa, servicios, equipos, distinciones, sitio, galeria: getPhotos(idLab, await readPhotos(), lab.grupos) }}/>
  </div>;
}
