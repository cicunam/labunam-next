// LabUNAM
// Páginas
// Marco del micrositio (/laboratorios/[id]/micrositio)
// Ivonne Aviles <daviles@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { notFound } from "next/navigation";

// Servicios
import { getById } from "@/server/laboratorios/laboratoriosService";

// Configuración de Next
export const dynamic = "force-dynamic";

// Utilidades
// La ficha pública existe y tiene micrositio; si no, responde 404.
async function requireMicrosite(
  id, // String - Identificador tomado de la URL
) {
  const lab = await getById(id);
  if (!lab || !lab.micrositio) {
    notFound();
  }
  return lab;
}

// Configuración de Next
// El layout raíz convierte este título en «Nombre | LabUNAM».
export async function generateMetadata({
  params, // Promise - Resuelve al objeto con los segmentos de la ruta; params.id es el laboratorio
}) {
  const lab = await requireMicrosite((await params).id);
  return { title: lab.nombre };
}

// Definición del marco
const MicrositeLayout = async ({
  children, // ReactNode - Contenido de la página de esta carpeta
  params, // Promise - Resuelve al objeto con los segmentos de la ruta; params.id es el laboratorio
}) => {
  // Datos
  const lab = await getById((await params).id);
  if (!lab || !lab.micrositio) {
    notFound();
  }

  // Interfaz
  return (
    <article>
      <p>
        <Link href={`/laboratorios/${lab.idLab}`}>← Volver a la ficha</Link>
      </p>
      <h1>{lab.nombre}</h1>
      <nav aria-label="Secciones del micrositio">
        <Link href={`/laboratorios/${lab.idLab}/micrositio`}>Inicio</Link>
        <Link href={`/laboratorios/${lab.idLab}/micrositio/antecedentes`}>Antecedentes</Link>
      </nav>
      {children}
    </article>
  );
};

export default MicrositeLayout;