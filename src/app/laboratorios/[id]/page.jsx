import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { getPhotos, readPhotos } from "@/lib/fotos/fotos";
import LaboratoryDialog from "@/components/organisms/LaboratoryDialog/LaboratoryDialog";
import AppLink from "@/components/atoms/AppLink/AppLink";
import styles from "./Laboratorio.module.css";

export const dynamic = "force-dynamic";
async function findLaboratorio(id) {
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }
  const lab = (await loadCatalog()).laboratorios.find((lab) => lab.idLab === Number(id));
  if (!lab) {
    notFound();
  }
  return lab;
}
export async function generateMetadata({ params }) {
  const lab = await findLaboratorio((await params).id);
  return {
    title: lab.nombre,
    description: `${lab.nombre}. ${lab.entidad}. ${lab.sedeNombre}. Consulta sus servicios, equipamiento y ubicación.`,
  };
}
const LaboratoryPage = async ({ params }) => {
  const lab = await findLaboratorio((await params).id);
  const {
    idLab,
    nombre: name,
    tipo,
    entidad,
    sedeNombre,
    ubicacion: location,
    mapa: mapUrl,
    servicios,
    equipos,
    distinciones,
    sitio: website,
  } = lab;
  return (
    <div className={`content ${styles.detail}`}>
      <AppLink href="/laboratorios">← Volver al catálogo</AppLink>
      <LaboratoryDialog
        key={idLab}
        initialLaboratorio={{
          idLab,
          nombre: name,
          tipo,
          entidad,
          sedeNombre,
          ubicacion: location,
          mapa: mapUrl,
          servicios,
          equipos,
          distinciones,
          sitio: website,
          galeria: getPhotos(idLab, await readPhotos(), lab.grupos),
        }}
      />
    </div>
  );
};

export default LaboratoryPage;
