// LabUNAM
// Pruebas unitarias
// fotosService.test (prioridad entre los manifiestos de imágenes)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { beforeEach, expect, test, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { getPhotos } from "../../lib/fotos/fotos";

// Servicios
import { readPhotos } from "./fotosService";

// Simulaciones
// readFile se sustituye para simular cada manifiesto sin tocar public/fotos.
vi.mock("node:fs/promises", () => ({ readFile: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

// Pruebas
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
