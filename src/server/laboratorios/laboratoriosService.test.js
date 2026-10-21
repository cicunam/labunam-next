// LabUNAM
// Pruebas unitarias
// laboratoriosService.test (fichas, búsqueda, conteos y respuestas de la API)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { beforeEach, expect, it, vi } from "vitest";
import { filterLaboratorios, getFacetValues } from "../../lib/buscador/buscador";

// Servicios
import { loadCatalog, assembleCatalog } from "./laboratoriosCatalogo";
import { readPhotos } from "../fotos/fotosService";
import {
  getById,
  getContactDetails,
  searchLaboratorios,
  getSearchOptions,
  countLaboratorios,
  getRecentLaboratorios,
  getFilterCounts,
} from "./laboratoriosService";
import { getDetails, getFilters } from "./laboratoriosController";

// Datos de prueba
import { createTestData } from "@datosPrueba/catalogo";

// Simulaciones
// El catálogo y las fotos se sustituyen por datos de prueba; armar el catálogo usa el código real.
vi.mock("./laboratoriosCatalogo", async (importOriginal) => ({
  ...(await importOriginal()),
  loadCatalog: vi.fn(),
}));
vi.mock("../fotos/fotosService", () => ({ readPhotos: vi.fn() }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(loadCatalog).mockResolvedValue(assembleCatalog(createTestData()));
  vi.mocked(readPhotos).mockResolvedValue({ 1: [{ src: "/fotos/prueba.webp" }] });
});

// Pruebas
it("la página y la API reciben la misma ficha y sólo campos públicos", async () => {
  const laboratorio = await getById("1");
  const response = await getDetails(null, { params: Promise.resolve({ id: "1" }) });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(laboratorio);
  expect(Object.keys(laboratorio).sort()).toEqual(
    [
      "idLab",
      "nombre",
      "tipo",
      "entidad",
      "sedeNombre",
      "ubicacion",
      "mapa",
      "servicios",
      "equipos",
      "distinciones",
      "sitio",
      "micrositio",
      "galeria",
    ].sort(),
  );
  expect(laboratorio.galeria[0].src).toBe("/fotos/prueba.webp");
});

it.each(["0", "-1", "1 OR 1=1", "01", ["1"], undefined])(
  "rechaza el ID %s sin consultar datos",
  async (id) => {
    expect(await getById(id)).toBeNull();
    expect(await getContactDetails(id)).toBeNull();
    const response = await getDetails(null, { params: Promise.resolve({ id }) });
    expect(response.status).toBe(400);
    expect(loadCatalog).not.toHaveBeenCalled();
  },
);

it("una ficha inexistente conserva el 404 y no lee fotografías", async () => {
  const response = await getDetails(null, { params: Promise.resolve({ id: "999" }) });
  expect(response.status).toBe(404);
  expect(readPhotos).not.toHaveBeenCalled();
});

it("oculta los errores internos de la carga", async () => {
  vi.mocked(loadCatalog).mockRejectedValue(new Error("Detalle privado de conexión"));
  const response = await getDetails(null, { params: Promise.resolve({ id: "1" }) });
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    error: "La ficha no está disponible. Intenta de nuevo.",
  });
});

it("contacto recibe sólo los campos que necesita, sin cargar las fotos", async () => {
  const laboratorio = await getContactDetails("1");
  expect(Object.keys(laboratorio).sort()).toEqual(
    ["idLab", "nombre", "entidad", "servicios", "sitio"].sort(),
  );
  expect(readPhotos).not.toHaveBeenCalled();
});

it("el catálogo y la API muestran los mismos conteos y opciones", async () => {
  const data = await searchLaboratorios({ q: "microscopia", tipo: "nacionales" });
  const response = await getFilters(
    new Request("http://localhost/api/filtros?q=microscopia&tipo=nacionales"),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ total: data.total, filters: data.filters });
  expect(data.results).toHaveLength(data.total);
  expect(data.total).toBeGreaterThan(0);
});

it("ignora parámetros repetidos y no modifica el catálogo al filtrar", async () => {
  const catalogo = await loadCatalog();
  const before = structuredClone(catalogo);
  const all = await searchLaboratorios({});
  const repeated = await searchLaboratorios({ q: ["microscopia", "rayos"], tipo: ["nacionales"] });
  expect(repeated.results).toEqual(all.results);
  expect(catalogo).toEqual(before);
});

it("la portada obtiene opciones, conteos y recientes sin cambiar el orden del catálogo", async () => {
  const catalogo = await loadCatalog();
  const before = structuredClone(catalogo);
  const [options, counts, recent] = await Promise.all([
    getSearchOptions(),
    countLaboratorios(),
    getRecentLaboratorios(4),
  ]);
  expect(counts.total).toBe(3);
  expect(counts.tipos.nacionales).toBe(1);
  expect(Object.values(counts.areas).some((total) => total > 0)).toBe(true);
  expect(options.locations).toEqual(catalogo.sedes);
  expect(options.suggestions).toEqual(catalogo.sugerencias);
  expect(recent).toHaveLength(3);
  expect(catalogo).toEqual(before);
});

it("el controlador de filtros responde 503 sin filtrar el error interno", async () => {
  vi.mocked(loadCatalog).mockRejectedValue(new Error("Detalle privado"));
  const response = await getFilters(new Request("http://localhost/api/filtros"));
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ error: "No se pudieron actualizar los conteos." });
});

it("los conteos de filtros calculan los cinco ejes respetando los otros filtros", async () => {
  const catalogo = await loadCatalog();
  const criteria = { q: "microscopia", tipo: "nacionales", disciplina: "biologia" };
  const result = await getFilterCounts(criteria);
  expect(result.total).toBe(filterLaboratorios(catalogo.laboratorios, criteria).length);
  expect(result.filters).toHaveLength(5);
  for (const filtro of result.filters) {
    for (const opcion of filtro.opciones) {
      expect(opcion.total).toBe(
        filterLaboratorios(catalogo.laboratorios, { ...criteria, [filtro.eje]: "" }).filter((lab) =>
          getFacetValues(lab, filtro.eje).includes(opcion.clave),
        ).length,
      );
    }
  }
});
