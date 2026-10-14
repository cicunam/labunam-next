// LabUNAM
// Pruebas unitarias
// presentacion.test (URL del catálogo y textos de conteo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { expect, it } from "vitest";
import { formatCounts, getCatalogUrl } from "./presentacion";

// Pruebas
it("conserva parámetros y elimina sólo el chip solicitado", () => {
  expect(getCatalogUrl({ q: "rayos x", tipo: "nacionales" }, { tipo: "" })).toBe(
    "/laboratorios?q=rayos+x",
  );
  expect(formatCounts(0, 1)).toBe("1 equipo");
  expect(formatCounts(0, 0)).toBe("");
});
