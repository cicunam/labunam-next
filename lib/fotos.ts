import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type Foto = { src: string; srcSet?: string; alt: string };
type Manifiesto = Record<string, { src: string; srcset?: string }[]>;
const respaldo = ["laboratorio-abc.jpeg", "mision.png", "vision.png"];

export async function leerFotos(): Promise<Manifiesto> {
  try {
    const base = JSON.parse(await readFile(join(process.cwd(), "public/fotos/manifiesto.json"), "utf8").catch(() => "{}")) as Manifiesto;
    const web = JSON.parse(await readFile(join(process.cwd(), "public/fotos/manifiesto-web.json"), "utf8").catch(() => "{}")) as Manifiesto;
    const manifiesto = { ...web, ...base };
    manifiesto.respaldo = JSON.parse(await readFile(join(process.cwd(), "public/fotos/respaldo.json"), "utf8").catch(() => "[]"));
    return manifiesto;
  }
  catch { return {}; }
}

export function fotosDe(id: number, manifiesto: Manifiesto): Foto[] {
  const fotos = manifiesto[String(id)];
  if (Array.isArray(fotos) && fotos.length) return fotos.slice(0, 3).map((foto) => ({ src: foto.src, srcSet: foto.srcset, alt: "" }));
  return [0, 1, 2].map((n) => {
    const posicion = (id + n) % 3;
    const foto = manifiesto.respaldo?.[posicion];
    return foto ? { src: foto.src, srcSet: foto.srcset, alt: "" } : { src: `/assets/images/${respaldo[posicion]}`, alt: "" };
  });
}
