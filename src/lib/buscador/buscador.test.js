// LabUNAM
// Pruebas unitarias
// buscador.test (búsqueda, validación de criterios y conteos por eje)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { describe, expect, it } from "vitest";
import {
  countFacet,
  ejes,
  filterLaboratorios,
  normalizeCriteria,
  getFacetValues,
} from "./buscador";

// Servicios
import { assembleCatalog } from "../../server/laboratorios/laboratoriosCatalogo";

// Datos de prueba
import { createTestData } from "@datosPrueba/catalogo";

// Constantes
// Catálogo armado con las filas ficticias, sin abrir MySQL.
const { laboratorios } = assembleCatalog(createTestData());

// Pruebas
describe("filtrar", () => {
  it("busca sin acentos y prioriza el nombre sobre las capacidades", () => {
    const results = filterLaboratorios(laboratorios, { q: "microscopia" });
    expect(results).toHaveLength(3);
    expect(results[0].idLab).toBe(1);
    expect(results[0].enNombre).toBe(true);
    expect(results[0].coincidencias).toEqual(["Microscopía óptica"]);
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
    const originals = [...laboratorios].reverse();
    expect(filterLaboratorios(originals, {}).map((lab) => lab.idLab)).toEqual([2, 3, 1]);
    expect(originals.map((lab) => lab.idLab)).toEqual([1, 3, 2]);
  });
  it("ordena por número de capacidades después de las coincidencias en nombre", () => {
    const extended = laboratorios.map((lab) =>
      lab.idLab === 2 ? { ...lab, servicios: [...lab.servicios, "Microscopía de prueba"] } : lab,
    );
    expect(filterLaboratorios(extended, { q: "microscopia" }).map((lab) => lab.idLab)).toEqual([
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
      const values = [...new Set(laboratorios.flatMap((lab) => getFacetValues(lab, eje)))];
      const totals = countFacet(laboratorios, {}, eje, [...values, "inexistente"]);
      expect(totals.inexistente).toBe(0);
      const sum = Object.values(totals).reduce((a, b) => a + b, 0);
      expect(sum).toBe(
        laboratorios.reduce((total, lab) => total + new Set(getFacetValues(lab, eje)).size, 0),
      );
      if (eje === "tipo" || eje === "sede") {
        expect(sum).toBe(laboratorios.length);
      }
    }
  });
  it("no exige reconocimiento a los laboratorios sin distinciones", () => {
    const totals = countFacet(laboratorios, {}, "reconocimiento", [
      "certificacion",
      "acreditacion",
      "micrositio",
    ]);
    expect(totals).toEqual({ certificacion: 1, acreditacion: 1, micrositio: 1 });
    expect(
      filterLaboratorios(laboratorios, { reconocimiento: "certificacion" }).map((lab) => lab.idLab),
    ).toEqual([1]);
  });
});
