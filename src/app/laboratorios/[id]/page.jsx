// LabUNAM
// Páginas
// Ficha de laboratorio (/laboratorios/[id])
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { notFound } from "next/navigation";

// Servicios
import { getById } from "@/server/laboratorios/laboratoriosService";

// Componentes
import { LaboratoryDialog, AppLink } from "@/components";

// Estilos
import styles from "./Laboratorio.module.css";

// Configuración de Next
export const dynamic = "force-dynamic";

// Utilidades
// Busca la ficha pública o responde 404 si el laboratorio no existe.
async function findLaboratorio(
  id, // String - Identificador del laboratorio tomado de la URL
) {
  const lab = await getById(id);
  if (!lab) {
    notFound();
  }
  return lab;
}

// Configuración de Next
// Título y descripción de la pestaña a partir de la ficha del laboratorio.
export async function generateMetadata({
  params, // Promise - Resuelve al objeto con los segmentos de la ruta; params.id es el laboratorio
}) {
  const lab = await findLaboratorio((await params).id);
  return {
    title: lab.nombre,
    description: `${lab.nombre}. ${lab.entidad}. ${lab.sedeNombre}. Consulta sus servicios, equipamiento y ubicación.`,
  };
}

// Definición de la página
const LaboratoryPage = async ({
  params, // Promise - Resuelve al objeto con los segmentos de la ruta; params.id es el laboratorio
}) => {
  // Datos
  const lab = await findLaboratorio((await params).id);

  // Interfaz
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
