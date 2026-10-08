import { afterEach, beforeEach, expect, it, vi } from "vitest";
const { createPoolMock, queryMock } = vi.hoisted(() => ({ createPoolMock: vi.fn(), queryMock: vi.fn() }));
vi.mock("mysql2/promise", () => ({ createPool: createPoolMock }));
const proceso = globalThis;
beforeEach(() => {
    delete proceso.poolLabunam;
    vi.resetModules();
    createPoolMock.mockReset().mockReturnValue({ query: queryMock });
    queryMock.mockReset().mockResolvedValue([[{ total: 3 }]]);
    vi.stubEnv("LABUNAM_DB_HOST", "example.invalid");
    vi.stubEnv("LABUNAM_DB_NAME", "catalogo_prueba");
    vi.stubEnv("LABUNAM_DB_USER", "usuario_prueba");
    vi.stubEnv("LABUNAM_DB_PASS", "clave_ficticia");
});
afterEach(() => { delete proceso.poolLabunam; vi.unstubAllEnvs(); });
it("reutiliza un único pool incluso después de recargar el módulo", async () => {
    const { query } = await import("./db");
    expect(await query("SELECT COUNT(*) AS total FROM tabla_prueba")).toEqual([{ total: 3 }]);
    vi.resetModules();
    const recargado = await import("./db");
    await recargado.query("SELECT COUNT(*) AS total FROM tabla_prueba");
    expect(createPoolMock).toHaveBeenCalledTimes(1);
});
it("no devuelve detalles de conexión cuando el motor falla", async () => {
    queryMock.mockRejectedValue(new Error("Detalle interno de prueba que no debe salir"));
    const { query } = await import("./db");
    await expect(query("SELECT 1")).rejects.toThrow("No fue posible consultar la base de LabUNAM.");
});
it("no intenta conectar si falta la configuración requerida", async () => {
    vi.stubEnv("LABUNAM_DB_HOST", "");
    const { query } = await import("./db");
    await expect(query("SELECT 1")).rejects.toThrow("No fue posible consultar la base de LabUNAM.");
    expect(createPoolMock).not.toHaveBeenCalled();
});
