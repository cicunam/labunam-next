// LabUNAM
// Utilidades compartidas
// ficha (carga de la ficha de laboratorio desde el navegador)
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
