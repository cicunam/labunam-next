// LabUNAM
// Utilidades compartidas
// api (las dos llamadas que el navegador hace a las rutas de API del portal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Definición del módulo
// Pide la ficha pública a la API y avisa con un mensaje visible si la respuesta falla.
export async function fetchLaboratorioDetails(
  id, // Number | String - Identificador del laboratorio
) {
  const respuesta = await fetch(`/api/laboratorios/${id}`);
  if (!respuesta.ok) {
    throw new Error("No se pudo cargar la ficha. Intenta de nuevo.");
  }
  return respuesta.json();
}
// Pide los conteos de filtros que resultarían de unos criterios, sin cambiar la URL del catálogo.
export async function fetchFilterCounts(
  criterios, // Object - Criterios del borrador: q y un valor por eje; los vacíos no viajan
  signal, // AbortSignal - Cancela la petición cuando el borrador cambia o el diálogo se desmonta
) {
  const parametros = new URLSearchParams(Object.entries(criterios).filter(([, valor]) => valor));
  const respuesta = await fetch(`/api/filtros?${parametros}`, { signal });
  if (!respuesta.ok) {
    throw new Error("No se pudieron actualizar los conteos.");
  }
  return respuesta.json();
}
