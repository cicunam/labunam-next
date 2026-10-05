import type { Laboratorio } from "../tipos/tipos";
import type { Foto } from "../fotos/fotos";

export type DatosFicha = Pick<Laboratorio, "idLab" | "nombre" | "tipo" | "entidad" | "sedeNombre" | "ubicacion" | "mapa" | "servicios" | "equipos" | "distinciones" | "sitio"> & { galeria: Foto[] };

export async function pedirFicha(id: number): Promise<DatosFicha> {
  const respuesta = await fetch(`/api/laboratorios/${id}`);
  if (!respuesta.ok) throw new Error("No se pudo cargar la ficha. Intenta de nuevo.");
  return respuesta.json();
}
