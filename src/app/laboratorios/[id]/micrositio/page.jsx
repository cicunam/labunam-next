// LabUNAM
// Páginas
// Inicio del micrositio (/laboratorios/[id]/micrositio)
// Ivonne Aviles <daviles@cic.unam.mx>

// Dependencias
import { notFound } from "next/navigation";

// Servicios
import { getMicrositeHome } from "@/server/laboratorios/laboratoriosService";

// Componentes
import { MicrositeHome } from "@/components";

// Definición de la página
const MicrositePage = async ({
  params, // Promise - Resuelve al objeto con los segmentos de la ruta; params.id es el laboratorio
}) => {
  // Datos
  const { id } = await params;
  const home = await getMicrositeHome(id);
  if (!home) {
    notFound();
  }

  // Interfaz
  return (
    <MicrositeHome
      idLab={id}
      paragraphs={home.paragraphs}
      mission={home.mission}
      vision={home.vision}
    />
  );
};

export default MicrositePage;