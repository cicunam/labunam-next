import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestData } from "./catalogo.fixtures";

const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn() }));
vi.mock("../db/db", () => ({ query: queryMock }));
beforeEach(() => {
  vi.resetModules();
  queryMock.mockReset();
  const datos = createTestData();
  queryMock.mockImplementation(async (sql) => {
    if (sql.includes("FROM r_seccion1")) {
      return datos.filas;
    }
    if (sql.includes("FROM catEstados")) {
      return datos.estados;
    }
    if (sql.includes("FROM catDisiplina")) {
      return datos.disciplinas;
    }
    if (sql.includes("FROM r_equipoPrincipal")) {
      return datos.equipos;
    }
    if (sql.includes("FROM r_certificaciones")) {
      return datos.certificaciones;
    }
    if (sql.includes("FROM r_acreditaciones")) {
      return datos.acreditaciones;
    }
    throw new Error("Consulta inesperada");
  });
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
describe("catálogo y caché", () => {
  it("consulta las seis fuentes públicas con el filtro de población", async () => {
    const { buildCatalog } = await import("./catalogo");
    const catalogo = await buildCatalog();
    expect(catalogo.laboratorios).toHaveLength(3);
    expect(queryMock).toHaveBeenCalledTimes(6);
    const sql = queryMock.mock.calls[0][0];
    expect(sql).toContain("s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)");
    expect(sql).toContain("s.dis38");
    expect(sql).not.toContain("SELECT *");
  });
  it("comparte una carga concurrente y reutiliza la copia durante 600 segundos", async () => {
    const { loadCatalog } = await import("./catalogo");
    const [primera, segunda] = await Promise.all([loadCatalog(), loadCatalog()]);
    expect(segunda).toBe(primera);
    vi.advanceTimersByTime(599_999);
    expect(await loadCatalog()).toBe(primera);
    expect(queryMock).toHaveBeenCalledTimes(6);
    vi.advanceTimersByTime(1);
    expect(await loadCatalog()).not.toBe(primera);
    expect(queryMock).toHaveBeenCalledTimes(12);
  });
  it("respeta la duración configurada", async () => {
    vi.stubEnv("LABUNAM_CATALOGO_SEGUNDOS", "5");
    const { loadCatalog } = await import("./catalogo");
    await loadCatalog();
    vi.advanceTimersByTime(5000);
    await loadCatalog();
    expect(queryMock).toHaveBeenCalledTimes(12);
  });
  it("sirve la copia vencida si falla la base y vuelve a intentarlo", async () => {
    const { loadCatalog } = await import("./catalogo");
    const copia = await loadCatalog();
    vi.advanceTimersByTime(600_000);
    queryMock.mockRejectedValueOnce(new Error("Fallo simulado"));
    expect(await loadCatalog()).toBe(copia);
    expect(await loadCatalog()).not.toBe(copia);
  });
  it("devuelve un error público sin detalles internos si no hay copia", async () => {
    const { loadCatalog } = await import("./catalogo");
    queryMock.mockRejectedValue(new Error("Detalle interno de prueba"));
    await expect(loadCatalog()).rejects.toThrow("El catálogo no está disponible en este momento.");
  });
});
