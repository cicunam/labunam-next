import type { Criterios, TipoLaboratorio } from "../tipos/tipos";

export const redes: Record<TipoLaboratorio, { nombre: string; singular: string; tono: "rojo" | "azul" | "verde" | "neutro" }> = {
  nacionales: { nombre: "Laboratorios nacionales", singular: "Laboratorio nacional", tono: "rojo" },
  universitarios: { nombre: "Laboratorios universitarios", singular: "Laboratorio universitario", tono: "azul" },
  unidades: { nombre: "Unidades de apoyo", singular: "Unidad de apoyo", tono: "verde" },
  internacionales: { nombre: "Laboratorios internacionales", singular: "Laboratorio internacional", tono: "neutro" },
};

export function getCatalogUrl(criterios: Criterios, cambios: Criterios = {}): string {
  const parametros = new URLSearchParams();
  for (const [clave, valor] of Object.entries({ ...criterios, ...cambios })) {
    if (valor) parametros.set(clave, valor);
  }
  return `/laboratorios${parametros.size ? `?${parametros}` : ""}`;
}

export function formatCounts(servicios: number, equipos: number): string {
  return [servicios ? `${servicios} ${servicios === 1 ? "servicio" : "servicios"}` : "", equipos ? `${equipos} ${equipos === 1 ? "equipo" : "equipos"}` : ""].filter(Boolean).join(" · ");
}
