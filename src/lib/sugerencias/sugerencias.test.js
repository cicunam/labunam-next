// LabUNAM
// Pruebas unitarias
// sugerencias.test (sugerencias del buscador y búsquedas recientes)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSearchOptions, saveRecentSearch, readRecentSearches } from "./sugerencias";

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
