// LabUNAM
// Utilidades compartidas
// presentacion (URL del catálogo y conteos visibles)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Definición del módulo
// URL del catálogo con los criterios no vacíos; los cambios reemplazan o quitan criterios.
export function getCatalogUrl(
  criterios, // Object - Criterios activos: q y un valor por eje
  cambios = {}, // Object Optional - Criterios que se sobrescriben; un valor vacío quita ese filtro
) {
  const parametros = new URLSearchParams();
  for (const [clave, valor] of Object.entries({ ...criterios, ...cambios })) {
    if (valor) {
      parametros.set(clave, valor);
    }
  }
  return `/laboratorios${parametros.size ? `?${parametros}` : ""}`;
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
