// LabUNAM
// Pruebas unitarias
// coincidencias.test (orden y límites de la búsqueda por nombre o siglas)
// Ángelo M

// Dependencias
import { describe, expect, it } from "vitest";
import { searchByName } from "./coincidencias";
import { institucionesEjemplo } from "@datosPrueba/solicitudes";

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
