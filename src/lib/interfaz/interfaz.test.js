// LabUNAM
// Pruebas unitarias
// interfaz.test (sugerencias, búsquedas recientes, URL del catálogo e imágenes)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSearchOptions, saveRecentSearch, readRecentSearches } from "../sugerencias/sugerencias";
import { getPhotos } from "../fotos/fotos";
import { formatCounts, getCatalogUrl } from "../presentacion/presentacion";

// Simulaciones
// Cada prueba que reemplaza localStorage lo restaura al terminar.
afterEach(() => vi.unstubAllGlobals());

// Pruebas
describe("búsquedas recientes", () => {
  it("completa sin acentos y no duplica recientes entre sugerencias", () => {
    expect(getSearchOptions("micro", ["Microscopía", "Microscopio"], ["microscopia"])).toEqual([
      { texto: "microscopia", reciente: true },
      { texto: "Microscopio", reciente: false },
    ]);
    expect(getSearchOptions("", [], ["Uno", "Dos"])).toHaveLength(2);
  });
  it("guarda como máximo cinco, mueve la última al frente y tolera almacenamiento inválido", () => {
    let valor = "malformado";
    vi.stubGlobal("localStorage", {
      getItem: () => valor,
      setItem: (_, dato) => {
        valor = dato;
      },
    });
    expect(readRecentSearches()).toEqual([]);
    ["uno", "dos", "tres", "cuatro", "cinco", "seis", "DÓS"].forEach(saveRecentSearch);
    expect(readRecentSearches()).toEqual(["DÓS", "seis", "cinco", "cuatro", "tres"]);
    saveRecentSearch("  ");
    expect(readRecentSearches()).toHaveLength(5);
  });
  it("sigue buscando cuando el navegador bloquea el almacenamiento", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error();
      },
      setItem: () => {
        throw new Error();
      },
    });
    expect(readRecentSearches()).toEqual([]);
    expect(() => saveRecentSearch("Microscopía")).not.toThrow();
  });
});
it("conserva parámetros y elimina sólo el chip solicitado", () => {
  expect(getCatalogUrl({ q: "rayos x", tipo: "nacionales" }, { tipo: "" })).toBe(
    "/laboratorios?q=rayos+x",
  );
  expect(formatCounts(0, 1)).toBe("1 equipo");
  expect(formatCounts(0, 0)).toBe("");
});
it("usa tres fotos como máximo y ofrece respaldo determinista", () => {
  expect(getPhotos(7, { 7: [{ src: "/fotos/7.webp", srcset: "/fotos/7.webp 640w" }] })[0]).toEqual({
    src: "/fotos/7.webp",
    srcSet: "/fotos/7.webp 640w",
    alt: "",
  });
  expect(getPhotos(1, {})).toHaveLength(1);
  expect(getPhotos(1, {})).toEqual(getPhotos(1, {}));
});
it("ignora el respaldo fotográfico genérico anterior", () => {
  expect(getPhotos(4, { respaldo: [{ src: "/foto-generica.webp" }] })[0].src).toBe(
    "/assets/respaldos/general.svg",
  );
});
