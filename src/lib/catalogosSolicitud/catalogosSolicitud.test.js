import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRequestCatalogRows } from "./catalogosSolicitud.fixtures";
const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn() }));
vi.mock("../db/db", () => ({ query: queryMock }));
const fuentes = [
    ["FROM catalogo_paises_edo", "estados"], ["FROM catalogo_paises", "paises"], ["FROM catalogo_instituciones", "instituciones"],
    ["FROM catalogo_dependencias", "dependencias"], ["FROM cat_cargos", "cargos"], ["FROM cat_tipo_muestra", "tiposMuestra"],
    ["FROM cat_tipo_colaboracion", "tiposColaboracion"],
];
beforeEach(() => {
    vi.resetModules();
    const filas = createRequestCatalogRows();
    queryMock.mockReset().mockImplementation(async (sql) => {
        const fuente = fuentes.find(([tabla]) => sql.includes(tabla));
        if (!fuente)
            throw new Error("Consulta inesperada");
        return filas[fuente[1]];
    });
    vi.useFakeTimers();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("catálogos de la solicitud", () => {
    it("consulta los siete catálogos con sus filtros de vigencia", async () => {
        const { buildRequestCatalogs } = await import("./catalogosSolicitud");
        await buildRequestCatalogs();
        const consultas = queryMock.mock.calls.map(([sql]) => sql);
        expect(consultas).toHaveLength(7);
        expect(consultas.find((sql) => sql.includes("catalogo_instituciones"))).toContain("anio_ActivoTermino >= YEAR(CURDATE())");
        expect(consultas.find((sql) => sql.includes("catalogo_dependencias"))).toContain("dep_status = 1 AND dep_fecha_cancela IS NULL");
        expect(consultas.find((sql) => sql.includes("catalogo_paises_edo"))).toContain("IN ('MEX', 'USA')");
    });
    it("normaliza claves y nombres, descarta vacíos y separa las instituciones", async () => {
        const { buildRequestCatalogs } = await import("./catalogosSolicitud");
        const { publicos, instituciones } = await buildRequestCatalogs();
        expect(publicos.paises).toEqual([{ clave: "ESP", nombre: "España" }, { clave: "MEX", nombre: "Mexico" }]);
        expect(publicos.estados).toEqual({ MEX: [{ clave: "9", nombre: "Ciudad de Mexico" }], USA: [{ clave: "70", nombre: "Texas" }] });
        expect(publicos.dependencias).toEqual([{ clave: "010", nombre: "Instituto de Demostración" }, { clave: "011", nombre: "CCH Plantel de Ejemplo" }]);
        expect(publicos).not.toHaveProperty("instituciones");
        expect(instituciones).toEqual([{ clave: "1", nombre: "Universidad de Demostracion", siglas: "UDD" }, { clave: "2", nombre: "Instituto de Ejemplo", siglas: "" }]);
    });
    it("comparte una carga concurrente y reutiliza la copia mientras no vence", async () => {
        const { loadRequestCatalogs } = await import("./catalogosSolicitud");
        const [primera, segunda] = await Promise.all([loadRequestCatalogs(), loadRequestCatalogs()]);
        expect(segunda).toBe(primera);
        expect(queryMock).toHaveBeenCalledTimes(7);
        vi.advanceTimersByTime(601_000);
        expect(await loadRequestCatalogs()).not.toBe(primera);
    });
    it("sirve la copia anterior si falla la base y oculta el error interno si no hay copia", async () => {
        const { loadRequestCatalogs } = await import("./catalogosSolicitud");
        const copia = await loadRequestCatalogs();
        vi.advanceTimersByTime(601_000);
        queryMock.mockRejectedValue(new Error("detalle interno"));
        expect(await loadRequestCatalogs()).toBe(copia);
        vi.resetModules();
        const recargado = await import("./catalogosSolicitud");
        await expect(recargado.loadRequestCatalogs()).rejects.toThrow("Los catálogos de la solicitud no están disponibles en este momento.");
    });
});
