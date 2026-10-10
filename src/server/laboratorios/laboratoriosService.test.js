import { beforeEach, expect, it, vi } from "vitest";
import { loadCatalog } from "../catalogo/catalogoService";
import { readPhotos } from "../fotos/fotosService";
import { assembleCatalog } from "../catalogo/catalogoAssembler";
import { createTestData } from "../catalogo/catalogo.fixtures";
import { getById, getContactDetails } from "./laboratoriosService";
import { getDetails } from "./laboratoriosController";

vi.mock("../catalogo/catalogoService", () => ({ loadCatalog: vi.fn() }));
vi.mock("../fotos/fotosService", () => ({ readPhotos: vi.fn() }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(loadCatalog).mockResolvedValue(assembleCatalog(createTestData()));
  vi.mocked(readPhotos).mockResolvedValue({ 1: [{ src: "/fotos/prueba.webp" }] });
});

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
