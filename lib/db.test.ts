import { afterEach, beforeEach, expect, it, vi } from "vitest";

const { crearPool, query } = vi.hoisted(() => ({ crearPool: vi.fn(), query: vi.fn() }));
vi.mock("mysql2/promise", () => ({ createPool: crearPool }));
const proceso = globalThis as typeof globalThis & { poolLabunam?: unknown };

beforeEach(() => {
  delete proceso.poolLabunam;
  vi.resetModules();
  crearPool.mockReset().mockReturnValue({ query });
  query.mockReset().mockResolvedValue([[{ total: 3 }]]);
  vi.stubEnv("LABUNAM_DB_HOST", "example.invalid");
  vi.stubEnv("LABUNAM_DB_NAME", "catalogo_prueba");
  vi.stubEnv("LABUNAM_DB_USER", "usuario_prueba");
  vi.stubEnv("LABUNAM_DB_PASS", "clave_ficticia");
});
afterEach(() => { delete proceso.poolLabunam; vi.unstubAllEnvs(); });

it("reutiliza un único pool incluso después de recargar el módulo", async () => {
  const { consultar } = await import("./db");
  expect(await consultar("SELECT COUNT(*) AS total FROM tabla_prueba")).toEqual([{ total: 3 }]);
  vi.resetModules();
  const recargado = await import("./db");
  await recargado.consultar("SELECT COUNT(*) AS total FROM tabla_prueba");
  expect(crearPool).toHaveBeenCalledTimes(1);
});

it("no devuelve detalles de conexión cuando el motor falla", async () => {
  query.mockRejectedValue(new Error("Detalle interno de prueba que no debe salir"));
  const { consultar } = await import("./db");
  await expect(consultar("SELECT 1")).rejects.toThrow("No fue posible consultar la base de LabUNAM.");
});

it("no intenta conectar si falta la configuración requerida", async () => {
  vi.stubEnv("LABUNAM_DB_HOST", "");
  const { consultar } = await import("./db");
  await expect(consultar("SELECT 1")).rejects.toThrow("No fue posible consultar la base de LabUNAM.");
  expect(crearPool).not.toHaveBeenCalled();
});
