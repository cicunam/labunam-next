import { beforeEach, expect, test, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { getPhotos, readPhotos } from "./fotos";

vi.mock("node:fs/promises", () => ({ readFile: vi.fn() }));
beforeEach(() => vi.resetAllMocks());
test("las fotos oficiales tienen prioridad y las aprobadas completan otros laboratorios", async () => {
  vi.mocked(readFile).mockImplementation(async (path) => {
    if (String(path).endsWith("manifiesto-web.json")) {
      return JSON.stringify({ 5: [{ src: "/web-5.webp" }], 28: [{ src: "/logo.webp" }] });
    }
    if (String(path).endsWith("manifiesto.json")) {
      return JSON.stringify({ 5: [{ src: "/oficial.webp" }] });
    }
    return "[]";
  });
  const fotos = await readPhotos();
  expect(getPhotos(5, fotos)[0].src).toBe("/oficial.webp");
  expect(getPhotos(28, fotos)).toHaveLength(1);
  expect(getPhotos(28, fotos)[0].src).toBe("/logo.webp");
});
test("las aprobadas funcionan aunque todavía no exista el manifiesto de originales", async () => {
  vi.mocked(readFile).mockImplementation(async (path) => {
    if (String(path).endsWith("manifiesto-web.json")) {
      return JSON.stringify({ 28: [{ src: "/logo.webp" }] });
    }
    throw Error("No existe");
  });
  expect(getPhotos(28, await readPhotos())[0].src).toBe("/logo.webp");
});
test("usa el área única y un respaldo general para varias áreas o ninguna", () => {
  expect(getPhotos(1, {}, ["quimica"])[0].src).toContain("/quimica.svg");
  expect(getPhotos(1, {}, ["quimica", "biologia"])[0].src).toContain("/general.svg");
  expect(getPhotos(1, {})).toHaveLength(1);
  expect(getPhotos(1, {})[0].alt).toContain("Sin fotografía disponible");
});
test("prioriza fotografías sobre logos y conserva el logo cuando es la única imagen", () => {
  const fotos = {
    1: [
      { src: "/logo.webp", tipo: "logo" },
      { src: "/foto.webp", tipo: "foto" },
    ],
  };
  expect(getPhotos(1, fotos)[0].src).toBe("/foto.webp");
  expect(getPhotos(2, { 2: [fotos["1"][0]] })[0].tipo).toBe("logo");
});
