// LabUNAM
// Servidor: solicitudes
// solicitudesController (respuestas HTTP de las rutas de API de solicitudes)
// Ángelo M

// Servicios
import { findInstitutions } from "./solicitudesCatalogo";

// Definición del controlador
// GET /api/solicitudes/instituciones?q=: sugerencias de instituciones.
export async function getInstitutions(
  request, // Request - Petición HTTP; q es el texto escrito
) {
  // El texto se recorta para no procesar entradas arbitrariamente largas.
  const text = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 100);
  try {
    return Response.json({ instituciones: await findInstitutions(text) });
  } catch {
    return Response.json({ error: "No se pudieron cargar las instituciones." }, { status: 503 });
  }
}
