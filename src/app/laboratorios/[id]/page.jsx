import { notFound } from "next/navigation";
import { getById } from "@/server/laboratorios/laboratoriosService";
import { LaboratoryDialog, AppLink } from "@/components";
import styles from "./Laboratorio.module.css";

export const dynamic = "force-dynamic";
async function findLaboratorio(id) {
  const lab = await getById(id);
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
  return (
    <div className={`content ${styles.detail}`}>
      <AppLink href="/laboratorios">← Volver al catálogo</AppLink>
      <LaboratoryDialog
        key={lab.idLab}
        initialLaboratorio={lab}
      />
    </div>
  );
};

export default LaboratoryPage;
