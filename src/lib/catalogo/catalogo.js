import { readCatalogRows } from "./catalogoQueries";
import { normalizeCatalog } from "../normalizeCatalog/normalizeCatalog";

/** Lee MySQL y transforma sus filas al catálogo público utilizado por la interfaz. */
export async function buildCatalog() {
  const rows = await readCatalogRows();
  return normalizeCatalog(rows);
}

// Esta caché pertenece a un proceso Node; cada worker mantiene su propia copia.
let cachedCatalog;
let expiresAt = 0;
let pendingCatalog;

/**
 * Devuelve el catálogo vigente y renueva una copia vencida cuando llega una petición.
 * Si falla MySQL, conserva el último catálogo válido; sin respaldo devuelve un error público.
 */
export async function loadCatalog() {
  if (cachedCatalog && Date.now() < expiresAt) {
    return cachedCatalog;
  }

  // Compartir la promesa evita ejecutar seis consultas por cada petición simultánea.
  if (pendingCatalog) {
    return pendingCatalog;
  }

  pendingCatalog = refreshCatalog();
  return pendingCatalog;
}

async function refreshCatalog() {
  try {
    const catalogo = await buildCatalog();
    const configuredSeconds = Number(process.env.LABUNAM_CATALOGO_SEGUNDOS ?? 600);
    const cacheSeconds =
      Number.isFinite(configuredSeconds) && configuredSeconds > 0 ? configuredSeconds : 600;

    // El plazo empieza al terminar la carga, no cuando se inició la consulta.
    expiresAt = Date.now() + cacheSeconds * 1000;
    cachedCatalog = catalogo;
    return catalogo;
  } catch {
    // No renovamos la fecha al fallar: la siguiente petición podrá intentar recuperar MySQL.
    if (cachedCatalog) {
      return cachedCatalog;
    }
    throw new Error("El catálogo no está disponible en este momento.");
  } finally {
    pendingCatalog = undefined;
  }
}
