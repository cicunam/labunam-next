// LabUNAM
// Servidor: solicitudes
// solicitudesCatalogo (catálogos del formulario de solicitud: carga, armado y caché)
// Ángelo M

// Dependencias
import { toTitleCase } from "../../lib/texto/texto";
import { searchByName } from "../../lib/coincidencias/coincidencias";

// Servicios
import CatalogoSolicitudDao from "./CatalogoSolicitudDao";

// Constantes
const catalogoSolicitudDao = new CatalogoSolicitudDao();
// Siglas de planteles de la UNAM presentes en el catálogo de dependencias.
const SIGLAS_DEPENDENCIAS = ["CCH", "ENP", "FES"];

// Estado de la caché
// Misma política que el catálogo de laboratorios: copia por proceso, carga concurrente
// compartida y respaldo de la última copia válida si la base falla.
let cachedCatalogs;
let expiresAt = 0;
let pendingCatalogs;

// Definición del servicio
export async function loadRequestCatalogs() {
  if (cachedCatalogs && Date.now() < expiresAt) {
    return cachedCatalogs;
  }
  if (pendingCatalogs) {
    return pendingCatalogs;
  }
  pendingCatalogs = buildRequestCatalogs()
    .then((catalogs) => {
      const seconds = Number(process.env.LABUNAM_CATALOGO_SEGUNDOS ?? 600);
      expiresAt = Date.now() + (Number.isFinite(seconds) && seconds > 0 ? seconds : 600) * 1000;
      cachedCatalogs = catalogs;
      return catalogs;
    })
    .catch(() => {
      if (cachedCatalogs) {
        return cachedCatalogs;
      }
      throw new Error("Los catálogos de la solicitud no están disponibles en este momento.");
    })
    .finally(() => {
      pendingCatalogs = undefined;
    });
  return pendingCatalogs;
}

export async function buildRequestCatalogs() {
  const [paises, estados, instituciones, dependencias, cargos, tiposMuestra, tiposColaboracion] =
    await Promise.all([
      catalogoSolicitudDao.getPaises(),
      catalogoSolicitudDao.getEstados(),
      catalogoSolicitudDao.getInstituciones(),
      catalogoSolicitudDao.getDependencias(),
      catalogoSolicitudDao.getCargos(),
      catalogoSolicitudDao.getTiposMuestra(),
      catalogoSolicitudDao.getTiposColaboracion(),
    ]);
  return {
    // Las instituciones se quedan en el servidor: son miles y se buscan por texto desde su ruta API.
    instituciones: toOptions(instituciones),
    publicos: {
      paises: toOptions(paises),
      estados: {
        MEX: toOptions(estados.filter((row) => row.pais_clave === "MEX")),
        USA: toOptions(estados.filter((row) => row.pais_clave === "USA")),
      },
      dependencias: toOptions(dependencias, SIGLAS_DEPENDENCIAS),
      cargos: toOptions(cargos),
      tiposMuestra: toOptions(tiposMuestra),
      tiposColaboracion: toOptions(tiposColaboracion),
    },
  };
}

// Instituciones vigentes que coinciden con el texto, para el autocompletado.
export async function findInstitutions(
  text, // String - Texto escrito por la persona
) {
  const { instituciones } = await loadRequestCatalogs();
  return searchByName(instituciones, text);
}

// Utilidades
// Los catálogos guardan muchos nombres en mayúsculas; se presentan con mayúsculas iniciales.
function toOptions(
  rows, // Array - Filas con clave, nombre y, en instituciones, siglas
  keptAcronyms = [], // Array Optional - Siglas que conservan sus mayúsculas
) {
  return rows
    .map(({ clave, nombre, siglas }) => ({
      clave: String(clave),
      nombre: toTitleCase(String(nombre ?? ""), keptAcronyms),
      ...(siglas !== undefined && { siglas: String(siglas ?? "").trim() }),
    }))
    .filter((opcion) => opcion.nombre);
}
