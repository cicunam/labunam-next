import { getFilters } from "./filtrosService";

export async function getAll(request) {
  try {
    const parameters = Object.fromEntries(new URL(request.url).searchParams);
    return Response.json(await getFilters(parameters));
  } catch {
    return Response.json({ error: "No se pudieron actualizar los conteos." }, { status: 503 });
  }
}
