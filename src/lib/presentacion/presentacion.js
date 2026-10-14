// LabUNAM
// Utilidades compartidas
// presentacion (URL del catálogo y conteos visibles)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Definición del módulo
// URL del catálogo con los criterios no vacíos; los cambios reemplazan o quitan criterios.
export function getCatalogUrl(
  criteria, // Object - Criterios activos: q y un valor por eje
  changes = {}, // Object Optional - Criterios que se sobrescriben; un valor vacío quita ese filtro
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...criteria, ...changes })) {
    if (value) {
      params.set(key, value);
    }
  }
  return `/laboratorios${params.size ? `?${params}` : ""}`;
}
// Texto breve con cuántos servicios y equipos tiene un laboratorio, omitiendo los ceros.
export function formatCounts(
  servicios, // Number - Cantidad de servicios
  equipos, // Number - Cantidad de equipos
) {
  return [
    servicios ? `${servicios} ${servicios === 1 ? "servicio" : "servicios"}` : "",
    equipos ? `${equipos} ${equipos === 1 ? "equipo" : "equipos"}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
