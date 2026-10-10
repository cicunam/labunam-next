export const redes = {
  nacionales: { nombre: "Laboratorios nacionales", singular: "Laboratorio nacional", tone: "red" },
  universitarios: {
    nombre: "Laboratorios universitarios",
    singular: "Laboratorio universitario",
    tone: "blue",
  },
  unidades: { nombre: "Unidades de apoyo", singular: "Unidad de apoyo", tone: "green" },
  internacionales: {
    nombre: "Laboratorios internacionales",
    singular: "Laboratorio internacional",
    tone: "neutral",
  },
};
export function getCatalogUrl(criterios, cambios = {}) {
  const parametros = new URLSearchParams();
  for (const [clave, valor] of Object.entries({ ...criterios, ...cambios })) {
    if (valor) {
      parametros.set(clave, valor);
    }
  }
  return `/laboratorios${parametros.size ? `?${parametros}` : ""}`;
}
export function formatCounts(servicios, equipos) {
  return [
    servicios ? `${servicios} ${servicios === 1 ? "servicio" : "servicios"}` : "",
    equipos ? `${equipos} ${equipos === 1 ? "equipo" : "equipos"}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
