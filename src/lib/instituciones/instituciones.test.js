import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchInstitutions, searchInstitutions } from "./instituciones";
import { institucionesEjemplo } from "./instituciones.fixtures";
afterEach(() => vi.unstubAllGlobals());
const nombres = (lista) => lista.map((institucion) => institucion.clave);
describe("búsqueda de instituciones", () => {
    it("no busca con menos de dos caracteres", () => {
        expect(searchInstitutions(institucionesEjemplo, "u")).toEqual([]);
    });
    it("ordena exactas, luego por inicio y luego por contenido, sin acentos", () => {
        expect(nombres(searchInstitutions(institucionesEjemplo, "universidad de demostración"))).toEqual(["2", "4"]);
        expect(nombres(searchInstitutions(institucionesEjemplo, "demostracion"))).toEqual(["4", "2"]);
        expect(nombres(searchInstitutions(institucionesEjemplo, "univer"))).toEqual(["2", "1", "4"]);
    });
    it("encuentra por siglas exactas", () => {
        expect(nombres(searchInstitutions(institucionesEjemplo, "unam"))).toEqual(["1"]);
    });
    it("respeta el límite de sugerencias", () => {
        expect(searchInstitutions(institucionesEjemplo, "de", 2)).toHaveLength(2);
    });
});
it("consulta la ruta de instituciones con el texto codificado", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ instituciones: institucionesEjemplo.slice(0, 1) }) });
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchInstitutions("a & b")).toHaveLength(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/solicitudes/instituciones?q=a%20%26%20b");
    fetchMock.mockResolvedValue({ ok: false });
    await expect(fetchInstitutions("ab")).rejects.toThrow("No se pudieron cargar las instituciones.");
});
