// LabUNAM
// Utilidades compartidas
// api (las llamadas que el navegador hace a las rutas de API del portal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Definición del módulo
// Pide la ficha pública a la API y avisa con un mensaje visible si la respuesta falla.
export async function fetchLaboratorioDetails(
  id, // Number | String - Identificador del laboratorio
) {
  const response = await fetch(`/api/laboratorios/${id}`);
  if (!response.ok) {
    throw new Error("No se pudo cargar la ficha. Intenta de nuevo.");
  }
  return response.json();
}
// Pide los conteos de filtros que resultarían de unos criterios, sin cambiar la URL del catálogo.
export async function fetchFilterCounts(
  criteria, // Object - Criterios del borrador: q y un valor por eje; los vacíos no viajan
  signal, // AbortSignal - Cancela la petición cuando el borrador cambia o el diálogo se desmonta
) {
  const params = new URLSearchParams(Object.entries(criteria).filter(([, value]) => value));
  const response = await fetch(`/api/filtros?${params}`, { signal });
  if (!response.ok) {
    throw new Error("No se pudieron actualizar los conteos.");
  }
  return response.json();
}
// Pide las instituciones que coinciden con lo escrito en el formulario de solicitud.
export async function fetchInstitutions(
  text, // String - Texto escrito por la persona
  signal, // AbortSignal Optional - Cancela la petición si la persona sigue escribiendo
) {
  const response = await fetch(`/api/solicitudes/instituciones?q=${encodeURIComponent(text)}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error("No se pudieron cargar las instituciones.");
  }
  return (await response.json()).instituciones;
}
