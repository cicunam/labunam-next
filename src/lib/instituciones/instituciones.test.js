// LabUNAM
// Pruebas unitarias
// instituciones.test (orden y límites de la búsqueda de instituciones)
// Ángelo M

// Dependencias
import { describe, expect, it } from "vitest";
import { searchInstitutions } from "./instituciones";
import { institucionesEjemplo } from "@datosPrueba/solicitudes";

// Pruebas
const nombres = (lista) => lista.map((institucion) => institucion.clave);
describe("búsqueda de instituciones", () => {
  it("no busca con menos de dos caracteres", () => {
    expect(searchInstitutions(institucionesEjemplo, "u")).toEqual([]);
  });
  it("ordena exactas, luego por inicio y luego por contenido, sin acentos", () => {
    expect(
      nombres(searchInstitutions(institucionesEjemplo, "universidad de demostración")),
    ).toEqual(["2", "4"]);
    expect(nombres(searchInstitutions(institucionesEjemplo, "demostracion"))).toEqual(["4", "2"]);
    expect(nombres(searchInstitutions(institucionesEjemplo, "univer"))).toEqual(["2", "1", "4"]);
  });
  it("encuentra por siglas exactas", () => {
    expect(nombres(searchInstitutions(institucionesEjemplo, "unam"))).toEqual(["1"]);
  });
  it("respeta el límite de sugerencias", () => {
    expect(searchInstitutions(institucionesEjemplo, "de", 2)).toHaveLength(2);
  });
});
