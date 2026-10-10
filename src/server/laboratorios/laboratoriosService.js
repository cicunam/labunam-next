import { loadCatalog } from "../catalogo/catalogoService";
import { readPhotos } from "../fotos/fotosService";
import { getPhotos } from "../../lib/fotos/fotos";

export function isValidId(id) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

async function findLaboratorio(id) {
  if (!isValidId(id)) {
    return null;
  }
  const { laboratorios } = await loadCatalog();
  return laboratorios.find((laboratorio) => laboratorio.idLab === Number(id)) ?? null;
}

/** Ficha pública compartida por la página y el modal. No expone el índice de búsqueda ni filas SQL. */
export async function getById(id) {
  const laboratorio = await findLaboratorio(id);
  if (!laboratorio) {
    return null;
  }
  const photos = await readPhotos();
  return {
    idLab: laboratorio.idLab,
    nombre: laboratorio.nombre,
    tipo: laboratorio.tipo,
    entidad: laboratorio.entidad,
    sedeNombre: laboratorio.sedeNombre,
    ubicacion: laboratorio.ubicacion,
    mapa: laboratorio.mapa,
    servicios: laboratorio.servicios,
    equipos: laboratorio.equipos,
    distinciones: laboratorio.distinciones,
    sitio: laboratorio.sitio,
    galeria: getPhotos(laboratorio.idLab, photos, laboratorio.grupos),
  };
}

export async function getContactDetails(id) {
  const laboratorio = await findLaboratorio(id);
  if (!laboratorio) {
    return null;
  }
  return {
    idLab: laboratorio.idLab,
    nombre: laboratorio.nombre,
    entidad: laboratorio.entidad,
    servicios: laboratorio.servicios,
    sitio: laboratorio.sitio,
  };
}
