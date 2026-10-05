import { beforeEach, expect, test, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { fotosDe, leerFotos } from "./fotos";

vi.mock("node:fs/promises", () => ({ readFile: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

test("las fotos oficiales tienen prioridad y las aprobadas completan otros laboratorios", async () => {
  vi.mocked(readFile).mockImplementation(async (path) => {
    if (String(path).endsWith("manifiesto-web.json")) return JSON.stringify({ 5: [{ src: "/web-5.webp" }], 28: [{ src: "/logo.webp" }] });
    if (String(path).endsWith("manifiesto.json")) return JSON.stringify({ 5: [{ src: "/oficial.webp" }] });
    return "[]";
  });
  const fotos = await leerFotos();
  expect(fotosDe(5, fotos)[0].src).toBe("/oficial.webp");
  expect(fotosDe(28, fotos)).toHaveLength(1);
  expect(fotosDe(28, fotos)[0].src).toBe("/logo.webp");
});

test("las aprobadas funcionan aunque todavía no exista el manifiesto de originales", async () => {
  vi.mocked(readFile).mockImplementation(async (path) => {
    if (String(path).endsWith("manifiesto-web.json")) return JSON.stringify({ 28: [{ src: "/logo.webp" }] });
    throw Error("No existe");
  });
  expect(fotosDe(28, await leerFotos())[0].src).toBe("/logo.webp");
});
