import { grupos } from "../grupos/grupos";

export function getPhotos(id, manifiesto, areas = []) {
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
