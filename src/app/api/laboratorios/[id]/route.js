import { loadCatalog } from "@/lib/catalogo/catalogo";
import { getPhotos, readPhotos } from "@/lib/fotos/fotos";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    return Response.json({ error: "Identificador inválido." }, { status: 400 });
  }
  try {
    const { laboratorios } = await loadCatalog();
    const lab = laboratorios.find((lab) => lab.idLab === Number(id));
    if (!lab) {
      return Response.json({ error: "El laboratorio no existe." }, { status: 404 });
    }
    const {
      idLab,
      nombre,
      tipo,
      entidad,
      sedeNombre,
      ubicacion,
      mapa,
      servicios,
      equipos,
      distinciones,
      sitio,
    } = lab;
    return Response.json({
      idLab,
      nombre,
      tipo,
      entidad,
      sedeNombre,
      ubicacion,
      mapa,
      servicios,
      equipos,
      distinciones,
      sitio,
      galeria: getPhotos(idLab, await readPhotos(), lab.grupos),
    });
  } catch {
    return Response.json(
      { error: "La ficha no está disponible. Intenta de nuevo." },
      { status: 503 },
    );
  }
}
