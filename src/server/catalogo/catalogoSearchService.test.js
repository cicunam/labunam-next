import { beforeEach, expect, it, vi } from "vitest";
import { loadCatalog } from "./catalogoService";
import { assembleCatalog } from "./catalogoAssembler";
import { createTestData } from "./catalogo.fixtures";
import { searchCatalog } from "./catalogoSearchService";
import { getAll } from "../filtros/filtrosController";
import { getHomeData } from "../home/homeService";

vi.mock("./catalogoService", () => ({ loadCatalog: vi.fn() }));
vi.mock("../fotos/fotosService", () => ({ readPhotos: vi.fn(async () => ({})) }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(loadCatalog).mockResolvedValue(assembleCatalog(createTestData()));
});

it("el catálogo y la API muestran los mismos conteos y opciones", async () => {
  const data = await searchCatalog({ q: "microscopia", tipo: "nacionales" });
  const response = await getAll(
    new Request("http://localhost/api/filtros?q=microscopia&tipo=nacionales"),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ total: data.total, filtros: data.filters });
  expect(data.results).toHaveLength(data.total);
  expect(data.total).toBeGreaterThan(0);
});

it("ignora parámetros repetidos y no modifica el catálogo al filtrar", async () => {
  const catalogo = await loadCatalog();
  const before = structuredClone(catalogo);
  const all = await searchCatalog({});
  const repeated = await searchCatalog({ q: ["microscopia", "rayos"], tipo: ["nacionales"] });
  expect(repeated.results).toEqual(all.results);
  expect(catalogo).toEqual(before);
});

it("la portada prepara incorporaciones sin cambiar el orden del catálogo compartido", async () => {
  const catalogo = await loadCatalog();
  const before = structuredClone(catalogo);
  const data = await getHomeData();
  expect(data.total).toBe(3);
  expect(data.locations).toEqual(catalogo.sedes);
  expect(data.suggestions).toEqual(catalogo.sugerencias);
  expect(data.recentLaboratorios).toHaveLength(3);
  expect(catalogo).toEqual(before);
});

it("el controlador de filtros responde 503 sin filtrar el error interno", async () => {
  vi.mocked(loadCatalog).mockRejectedValue(new Error("Detalle privado"));
  const response = await getAll(new Request("http://localhost/api/filtros"));
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ error: "No se pudieron actualizar los conteos." });
});
