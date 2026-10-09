import { afterEach, describe, expect, it, vi } from "vitest";
import { getSearchOptions, saveRecentSearch, readRecentSearches } from "../sugerencias/sugerencias";
import { prepareFilters } from "../filtros/filtros";
import { normalizeCatalog } from "../normalizeCatalog/normalizeCatalog";
import { createTestData } from "../catalogo/catalogo.fixtures";
import { filterLaboratorios, getFacetValues } from "../buscador/buscador";
import { getPhotos } from "../fotos/fotos";
import { formatCounts, getCatalogUrl } from "../presentacion/presentacion";
afterEach(() => vi.unstubAllGlobals());
describe("búsquedas recientes", () => {
    it("completa sin acentos y no duplica recientes entre sugerencias", () => {
        expect(getSearchOptions("micro", ["Microscopía", "Microscopio"], ["microscopia"])).toEqual([{ texto: "microscopia", reciente: true }, { texto: "Microscopio", reciente: false }]);
        expect(getSearchOptions("", [], ["Uno", "Dos"])).toHaveLength(2);
    });
    it("guarda como máximo cinco, mueve la última al frente y tolera almacenamiento inválido", () => {
        let valor = "malformado";
        vi.stubGlobal("localStorage", { getItem: () => valor, setItem: (_, dato) => { valor = dato; } });
        expect(readRecentSearches()).toEqual([]);
        ["uno", "dos", "tres", "cuatro", "cinco", "seis", "DÓS"].forEach(saveRecentSearch);
        expect(readRecentSearches()).toEqual(["DÓS", "seis", "cinco", "cuatro", "tres"]);
        saveRecentSearch("  ");
        expect(readRecentSearches()).toHaveLength(5);
    });
    it("sigue buscando cuando el navegador bloquea el almacenamiento", () => {
        vi.stubGlobal("localStorage", { getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); } });
        expect(readRecentSearches()).toEqual([]);
        expect(() => saveRecentSearch("Microscopía")).not.toThrow();
    });
});
it("calcula los cinco ejes respetando los otros filtros", () => {
    const catalogo = normalizeCatalog(createTestData());
    const criterios = { q: "microscopia", tipo: "nacionales", disciplina: "biologia" };
    const resultado = prepareFilters(catalogo, criterios);
    expect(resultado.total).toBe(filterLaboratorios(catalogo.laboratorios, criterios).length);
    expect(resultado.filtros).toHaveLength(5);
    for (const filtro of resultado.filtros)
        for (const opcion of filtro.opciones) {
            expect(opcion.total).toBe(filterLaboratorios(catalogo.laboratorios, { ...criterios, [filtro.eje]: "" }).filter((lab) => getFacetValues(lab, filtro.eje).includes(opcion.clave)).length);
        }
});
it("conserva parámetros y elimina sólo el chip solicitado", () => {
    expect(getCatalogUrl({ q: "rayos x", tipo: "nacionales" }, { tipo: "" })).toBe("/laboratorios?q=rayos+x");
    expect(formatCounts(0, 1)).toBe("1 equipo");
    expect(formatCounts(0, 0)).toBe("");
});
it("usa tres fotos como máximo y ofrece respaldo determinista", () => {
    expect(getPhotos(7, { "7": [{ src: "/fotos/7.webp", srcset: "/fotos/7.webp 640w" }] })[0]).toEqual({ src: "/fotos/7.webp", srcSet: "/fotos/7.webp 640w", alt: "" });
    expect(getPhotos(1, {})).toHaveLength(1);
    expect(getPhotos(1, {})).toEqual(getPhotos(1, {}));
});
it("ignora el respaldo fotográfico genérico anterior", () => {
    expect(getPhotos(4, { respaldo: [{ src: "/foto-generica.webp" }] })[0].src).toBe("/assets/respaldos/general.svg");
});
