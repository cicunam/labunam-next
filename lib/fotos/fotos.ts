import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { grupos } from "../grupos/grupos";
import type { Grupo } from "../tipos/tipos";

export type Foto = { src: string; srcSet?: string; alt: string; tipo?: "foto" | "logo" | "ilustracion" };
type Manifiesto = Record<string, { src: string; srcset?: string; tipo?: "foto" | "logo" }[]>;

export async function readPhotos(): Promise<Manifiesto> {
  try {
    const base = JSON.parse(await readFile(join(process.cwd(), "public/fotos/manifiesto.json"), "utf8").catch(() => "{}")) as Manifiesto;
    const web = JSON.parse(await readFile(join(process.cwd(), "public/fotos/manifiesto-web.json"), "utf8").catch(() => "{}")) as Manifiesto;
    const manifiesto = { ...web, ...base };
    return manifiesto;
  }
  catch { return {}; }
}

export function getPhotos(id: number, manifiesto: Manifiesto, areas: Grupo[] = []): Foto[] {
  const fotos = manifiesto[String(id)];
  if (Array.isArray(fotos) && fotos.length) {
    // Fotografías primero; orden editorial conservado dentro de cada tipo.
    return [...fotos].sort((a, b) => Number(a.tipo === "logo") - Number(b.tipo === "logo")).slice(0, 3)
      .map((foto) => ({ src: foto.src, srcSet: foto.srcset, alt: foto.tipo === "logo" ? "Logo del laboratorio" : "", ...(foto.tipo ? { tipo: foto.tipo } : {}) }));
  }
  const unicas = [...new Set(areas)];
  const area = unicas.length === 1 ? grupos.find((g) => g.clave === unicas[0]) : undefined;
  return [{
    src: `/assets/respaldos/${area?.clave ?? "general"}.svg`,
    alt: `Sin fotografía disponible. Ilustración ${area ? "de " + area.etiqueta : "general de laboratorio"}.`,
    tipo: "ilustracion",
  }];
}
