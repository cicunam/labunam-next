// LabUNAM
// Utilidades compartidas
// fotos (imágenes de un laboratorio o su ilustración de respaldo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { grupos } from "../grupos/grupos";

// Definición del módulo
// Hasta tres imágenes aprobadas, fotografías antes que logos; sin imágenes, la ilustración del área.
export function getPhotos(
  id, // Number - Identificador del laboratorio
  manifiesto, // Object - Fotos aprobadas por idLab, leídas de los manifiestos; cada una con src, srcset y tipo
  areas = [], // Array Optional - Claves de área del laboratorio, para elegir la ilustración
) {
  const fotos = manifiesto[String(id)];
  if (Array.isArray(fotos) && fotos.length) {
    // Fotografías primero; orden editorial conservado dentro de cada tipo.
    return [...fotos]
      .sort((a, b) => Number(a.tipo === "logo") - Number(b.tipo === "logo"))
      .slice(0, 3)
      .map((foto) => ({
        src: foto.src,
        srcSet: foto.srcset,
        alt: foto.tipo === "logo" ? "Logo del laboratorio" : "",
        ...(foto.tipo ? { tipo: foto.tipo } : {}),
      }));
  }
  const unicas = [...new Set(areas)];
  const area = unicas.length === 1 ? grupos.find((g) => g.clave === unicas[0]) : undefined;
  return [
    {
      src: `/assets/respaldos/${area?.clave ?? "general"}.svg`,
      alt: `Sin fotografía disponible. Ilustración ${area ? "de " + area.etiqueta : "general de laboratorio"}.`,
      tipo: "illustration",
    },
  ];
}
