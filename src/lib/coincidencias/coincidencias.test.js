// LabUNAM
// Pruebas unitarias
// coincidencias.test (orden y límites de la búsqueda por nombre o siglas)
// Ángelo M

// Dependencias
import { describe, expect, it } from "vitest";
import { filterByName, searchByName, withSearchKeys } from "./coincidencias";
import { catalogosEjemplo, institucionesEjemplo } from "@datosPrueba/solicitudes";

// Pruebas
const nombres = (lista) => lista.map((institucion) => institucion.clave);
describe("búsqueda por nombre o siglas", () => {
  it("no busca con menos de dos caracteres", () => {
    expect(searchByName(institucionesEjemplo, "u")).toEqual([]);
  });
  it("ordena exactas, luego por inicio y luego por contenido, sin acentos", () => {
    expect(nombres(searchByName(institucionesEjemplo, "universidad de demostración"))).toEqual([
      "2",
      "4",
    ]);
    expect(nombres(searchByName(institucionesEjemplo, "demostracion"))).toEqual(["4", "2"]);
    expect(nombres(searchByName(institucionesEjemplo, "univer"))).toEqual(["2", "1", "4"]);
  });
  it("encuentra por siglas exactas", () => {
    expect(nombres(searchByName(institucionesEjemplo, "unam"))).toEqual(["1"]);
  });
  it("respeta el límite de sugerencias", () => {
    expect(searchByName(institucionesEjemplo, "de", 2)).toHaveLength(2);
  });
});

it("da los mismos resultados con las claves de búsqueda precalculadas", () => {
  const precalculadas = withSearchKeys(institucionesEjemplo);
  expect(precalculadas[0]).toMatchObject({
    searchName: "universidad nacional autonoma de mexico",
    searchAcronym: "unam",
  });
  for (const text of ["unam", "demostracion", "univer"]) {
    expect(searchByName(precalculadas, text).map((item) => item.clave)).toEqual(
      searchByName(institucionesEjemplo, text).map((item) => item.clave),
    );
  }
});

describe("filtro de listas locales", () => {
  const nombres = (lista) => lista.map((item) => item.nombre);
  it("sin texto devuelve la lista completa", () => {
    expect(filterByName(catalogosEjemplo.paises, "")).toEqual(catalogosEjemplo.paises);
  });
  it("pone primero las que empiezan con el texto y no distingue acentos", () => {
    expect(nombres(filterByName(catalogosEjemplo.paises, "a"))).toEqual([
      "Argentina",
      "Canadá",
      "España",
      "Estados Unidos",
    ]);
    expect(nombres(filterByName(catalogosEjemplo.paises, "mexi"))).toEqual(["México"]);
  });
  it("con una sola letra ya filtra, a diferencia de la búsqueda remota", () => {
    expect(nombres(filterByName(catalogosEjemplo.paises, "c"))).toEqual(["Canadá", "México"]);
  });
});
