import { getById, isValidId } from "./laboratoriosService";

/** Adapta el servicio a HTTP; las páginas llaman al servicio directamente. */
export async function getDetails(_request, { params }) {
  const { id } = await params;
  if (!isValidId(id)) {
    return Response.json({ error: "Identificador inválido." }, { status: 400 });
  }
  try {
    const laboratorio = await getById(id);
    if (!laboratorio) {
      return Response.json({ error: "El laboratorio no existe." }, { status: 404 });
    }
    return Response.json(laboratorio);
  } catch {
    return Response.json(
      { error: "La ficha no está disponible. Intenta de nuevo." },
      { status: 503 },
    );
  }
}
