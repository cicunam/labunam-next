export async function fetchLaboratorioDetails(id) {
    const respuesta = await fetch(`/api/laboratorios/${id}`);
    if (!respuesta.ok)
        throw new Error("No se pudo cargar la ficha. Intenta de nuevo.");
    return respuesta.json();
}
