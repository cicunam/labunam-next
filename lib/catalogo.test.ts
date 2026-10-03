import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { datosDePrueba } from "./catalogo.fixtures";

const { consulta } = vi.hoisted(() => ({ consulta: vi.fn() }));
vi.mock("./db", () => ({ consultar: consulta }));

beforeEach(() => {
  vi.resetModules();
  consulta.mockReset();
  const datos = datosDePrueba();
  consulta.mockImplementation(async (sql: string) => {
    if (sql.includes("FROM r_seccion1")) return datos.filas;
    if (sql.includes("FROM catEstados")) return datos.estados;
    if (sql.includes("FROM catDisiplina")) return datos.disciplinas;
    if (sql.includes("FROM r_equipoPrincipal")) return datos.equipos;
    if (sql.includes("FROM r_certificaciones")) return datos.certificaciones;
    if (sql.includes("FROM r_acreditaciones")) return datos.acreditaciones;
    throw new Error("Consulta inesperada");
  });
  vi.useFakeTimers();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

describe("catálogo y caché", () => {
  it("consulta las seis fuentes públicas con el filtro de población", async () => {
    const { construirCatalogo } = await import("./catalogo");
    const catalogo = await construirCatalogo();
    expect(catalogo.laboratorios).toHaveLength(3);
    expect(consulta).toHaveBeenCalledTimes(6);
    const sql = consulta.mock.calls[0][0] as string;
    expect(sql).toContain("s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)");
    expect(sql).toContain("s.dis38");
    expect(sql).not.toContain("SELECT *");
  });
  it("comparte una carga concurrente y reutiliza la copia durante 600 segundos", async () => {
    const { cargarCatalogo } = await import("./catalogo");
    const [primera, segunda] = await Promise.all([cargarCatalogo(), cargarCatalogo()]);
    expect(segunda).toBe(primera);
    vi.advanceTimersByTime(599_999);
    expect(await cargarCatalogo()).toBe(primera);
    expect(consulta).toHaveBeenCalledTimes(6);
    vi.advanceTimersByTime(1);
    expect(await cargarCatalogo()).not.toBe(primera);
    expect(consulta).toHaveBeenCalledTimes(12);
  });
  it("respeta la duración configurada", async () => {
    vi.stubEnv("LABUNAM_CATALOGO_SEGUNDOS", "5");
    const { cargarCatalogo } = await import("./catalogo");
    await cargarCatalogo();
    vi.advanceTimersByTime(5000);
    await cargarCatalogo();
    expect(consulta).toHaveBeenCalledTimes(12);
  });
  it("sirve la copia vencida si falla la base y vuelve a intentarlo", async () => {
    const { cargarCatalogo } = await import("./catalogo");
    const copia = await cargarCatalogo();
    vi.advanceTimersByTime(600_000);
    consulta.mockRejectedValueOnce(new Error("Fallo simulado"));
    expect(await cargarCatalogo()).toBe(copia);
    expect(await cargarCatalogo()).not.toBe(copia);
  });
  it("devuelve un error público sin detalles internos si no hay copia", async () => {
    const { cargarCatalogo } = await import("./catalogo");
    consulta.mockRejectedValue(new Error("Detalle interno de prueba"));
    await expect(cargarCatalogo()).rejects.toThrow("El catálogo no está disponible en este momento.");
  });
});
