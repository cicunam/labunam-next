import { describe, expect, it } from "vitest";
import {
  countFacet,
  ejes,
  filterLaboratorios,
  normalizeCriteria,
  getFacetValues,
} from "./buscador";
import { assembleCatalog } from "../../server/catalogo/catalogoAssembler";
import { createTestData } from "../../server/catalogo/catalogo.fixtures";

const { laboratorios } = assembleCatalog(createTestData());
describe("filtrar", () => {
  it("busca sin acentos y prioriza el nombre sobre las capacidades", () => {
    const resultados = filterLaboratorios(laboratorios, { q: "microscopia" });
    expect(resultados).toHaveLength(3);
    expect(resultados[0].idLab).toBe(1);
    expect(resultados[0].enNombre).toBe(true);
    expect(resultados[0].coincidencias).toEqual(["Microscopía óptica"]);
  });
  it("exige todas las palabras en cualquier orden y combina filtros", () => {
    expect(filterLaboratorios(laboratorios, { q: " X   RÁYOS " }).map((lab) => lab.idLab)).toEqual([
      2,
    ]);
    expect(
      filterLaboratorios(laboratorios, { q: "microscopia", tipo: "nacionales" }).map(
        (lab) => lab.idLab,
      ),
    ).toEqual([1]);
    expect(filterLaboratorios(laboratorios, { q: "xyzzy" })).toEqual([]);
  });
  it("ignora valores desconocidos en cada eje", () => {
    for (const eje of ejes) {
      expect(filterLaboratorios(laboratorios, { [eje]: "inexistente" })).toHaveLength(3);
    }
    expect(normalizeCriteria(laboratorios, { sede: "inexistente", tipo: "nacionales" })).toEqual({
      q: "",
      tipo: "nacionales",
    });
  });
  it("mantiene filtros válidos que combinados dan cero", () => {
    expect(filterLaboratorios(laboratorios, { tipo: "nacionales", sede: "queretaro" })).toEqual([]);
  });
  it("ordena alfabéticamente sin búsqueda y no modifica la colección original", () => {
    const originales = [...laboratorios].reverse();
    expect(filterLaboratorios(originales, {}).map((lab) => lab.idLab)).toEqual([2, 3, 1]);
    expect(originales.map((lab) => lab.idLab)).toEqual([1, 3, 2]);
  });
  it("ordena por número de capacidades después de las coincidencias en nombre", () => {
    const ampliados = laboratorios.map((lab) =>
      lab.idLab === 2 ? { ...lab, servicios: [...lab.servicios, "Microscopía de prueba"] } : lab,
    );
    expect(filterLaboratorios(ampliados, { q: "microscopia" }).map((lab) => lab.idLab)).toEqual([
      1, 2, 3,
    ]);
  });
});
describe("contarEje", () => {
  it("elimina únicamente la selección del eje contado", () => {
    expect(
      countFacet(laboratorios, { tipo: "nacionales", sede: "queretaro" }, "tipo", [
        "nacionales",
        "universitarios",
        "unidades",
      ]),
    ).toEqual({ nacionales: 0, universitarios: 1, unidades: 0 });
    expect(
      countFacet(laboratorios, { q: "rayos" }, "sede", ["queretaro", "ciudad-de-mexico"]),
    ).toEqual({ queretaro: 1, "ciudad-de-mexico": 0 });
  });
  it("cuenta cada pertenencia una vez y conserva los ceros", () => {
    for (const eje of ejes) {
      const valores = [...new Set(laboratorios.flatMap((lab) => getFacetValues(lab, eje)))];
      const totales = countFacet(laboratorios, {}, eje, [...valores, "inexistente"]);
      expect(totales.inexistente).toBe(0);
      const suma = Object.values(totales).reduce((a, b) => a + b, 0);
      expect(suma).toBe(
        laboratorios.reduce((total, lab) => total + new Set(getFacetValues(lab, eje)).size, 0),
      );
      if (eje === "tipo" || eje === "sede") {
        expect(suma).toBe(laboratorios.length);
      }
    }
  });
  it("no exige reconocimiento a los laboratorios sin distinciones", () => {
    const totales = countFacet(laboratorios, {}, "reconocimiento", [
      "certificacion",
      "acreditacion",
      "micrositio",
    ]);
    expect(totales).toEqual({ certificacion: 1, acreditacion: 1, micrositio: 1 });
    expect(
      filterLaboratorios(laboratorios, { reconocimiento: "certificacion" }).map((lab) => lab.idLab),
    ).toEqual([1]);
  });
});
