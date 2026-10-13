// LabUNAM
// Servidor: laboratorios
// laboratoriosCatalogo (todos los laboratorios en memoria: carga, armado y caché)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { slugify, normalizeText, toTitleCase, uniqueValues } from "../../lib/texto/texto";

// Servicios
import LaboratorioDao, { toLaboratorio } from "./LaboratorioDao";
import DisciplinaDao from "../disciplinas/DisciplinaDao";

// Constantes
const laboratorioDao = new LaboratorioDao();
const disciplinaDao = new DisciplinaDao();

// Estado de la caché
// Pertenece a un proceso Node; cada worker mantiene su propia copia.
let cachedCatalog;
let expiresAt = 0;
let pendingCatalog;

// Definición del servicio
// Punto de entrada para el servicio de laboratorios: devuelve el catálogo vigente y
// lo renueva cuando venció. Si falla MySQL, conserva el último catálogo válido; sin
// respaldo devuelve un error público.
export async function loadCatalog() {
  if (cachedCatalog && Date.now() < expiresAt) {
    return cachedCatalog;
  }

  // Compartir la promesa evita repetir la carga por cada petición simultánea.
  if (pendingCatalog) {
    return pendingCatalog;
  }

  pendingCatalog = refreshCatalog();
  return pendingCatalog;
}

export async function buildCatalog() {
  // Dos lecturas por lote: laboratorios con todas sus relaciones y el catálogo de disciplinas.
  const [filas, disciplinas] = await Promise.all([
    laboratorioDao.getAllActive(),
    disciplinaDao.getAll(),
  ]);

  return assembleCatalog({ filas, disciplinas });
}

// Convierte las filas en laboratorios y prepara las opciones de filtros y sugerencias.
export function assembleCatalog(
  rows, // Object - { filas, disciplinas }: filas de LaboratorioDao y de DisciplinaDao
) {
  const disciplinas = new Map(
    rows.disciplinas.map((fila) => [Number(fila.idDis), toTitleCase(fila.disiplina)]),
  );
  const laboratorios = rows.filas.map((fila) => toLaboratorio(fila, disciplinas)).filter(Boolean);
  const nombresDisciplinas = [...disciplinas.values()];

  const sugerencias = buildSuggestions(laboratorios, nombresDisciplinas);
  laboratorios.sort((first, second) => first.nombre.localeCompare(second.nombre, "es"));

  return {
    laboratorios,
    sedes: buildOptions(
      laboratorios.map((laboratorio) => laboratorio.sedeNombre),
      laboratorios,
      "sede",
    ),
    disciplinas: buildOptions(nombresDisciplinas, laboratorios, "disciplinas"),
    sugerencias,
  };
}

// Utilidades

// Opciones de un filtro con clave, etiqueta y total, ordenadas de mayor a menor total.
function buildOptions(
  valores, // Array - Etiquetas (String) de sedes o disciplinas
  laboratorios, // Array - Laboratorios ya armados, para contar cuántos tiene cada opción
  eje, // String - "sede" o "disciplinas"
) {
  const etiquetas = new Map(valores.filter(Boolean).map((valor) => [slugify(valor), valor]));
  const totales = new Map();
  for (const lab of laboratorios) {
    const claves = eje === "sede" ? [lab.sede] : lab.disciplinas.map(slugify);
    for (const valor of new Set(claves)) {
      totales.set(valor, (totales.get(valor) ?? 0) + 1);
    }
  }
  return [...etiquetas]
    .map(([clave, etiqueta]) => ({ clave, etiqueta, total: totales.get(clave) ?? 0 }))
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
}

function buildSuggestions(
  laboratorios, // Array - Laboratorios ya armados
  disciplinas, // Array - Nombres (String) de todas las disciplinas
) {
  const frecuencias = new Map();
  for (const laboratorio of laboratorios) {
    const equipos = laboratorio.equipos;
    for (const equipo of equipos) {
      const frecuencia = frecuencias.get(normalizeText(equipo)) ?? {
        etiqueta: toTitleCase(equipo.toUpperCase()),
        total: 0,
      };
      frecuencia.total++;
      frecuencias.set(normalizeText(equipo), frecuencia);
    }
  }
  // Las sugerencias combinan disciplinas con equipos presentes en al menos tres laboratorios.
  // Limitamos a 60 equipos antes de enviar esta lista pequeña al buscador del navegador.
  const frecuentes = [...frecuencias.values()]
    .filter((equipo) => equipo.total >= 3)
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"))
    .slice(0, 60);
  return uniqueValues([...disciplinas, ...frecuentes.map((equipo) => equipo.etiqueta)]);
}

// Renueva la copia y fija su vencimiento; la usa loadCatalog.
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
