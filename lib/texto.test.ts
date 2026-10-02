import { describe, expect, it } from "vitest";
import { clave, plano, titulo } from "./texto";

describe("plano", () => {
  it.each([
    ["Microscopía Óptica", "microscopia optica"],
    ["  ÁÉÍÓÚ ÜÑ ÀÈÌÒÙ  ", "aeiou un aeiou"],
    ["", ""],
  ])("normaliza %s", (entrada, salida) => expect(plano(entrada)).toBe(salida));
});

describe("clave", () => {
  it.each([
    ["Ciencias de la Tierra e Ingenierías", "ciencias-de-la-tierra-e-ingenierias"],
    [" ¡QUÍMICA / RMN 3D! ", "quimica-rmn-3d"],
    ["---", ""],
  ])("genera la clave de %s", (entrada, salida) => expect(clave(entrada)).toBe(salida));
});

describe("titulo", () => {
  it("conserva las siglas indicadas", () => {
    expect(titulo("LABORATORIO NACIONAL HAWC DE RAYOS GAMMA", ["HAWC"])).toBe("Laboratorio Nacional HAWC de Rayos Gamma");
    expect(titulo("CENTRO ABC XYZ DE PRUEBAS", ["ABC-XYZ"])).toBe("Centro ABC XYZ de Pruebas");
  });
  it("respeta la escritura manual", () => {
    expect(titulo("Laboratorio de Nanosensores Biofotónicos")).toBe("Laboratorio de Nanosensores Biofotónicos");
  });
  it.each([
    ["  LABORATORIO   DE\nÓPTICA ", "Laboratorio de Óptica"],
    ["DE LA UNAM PARA HPLC Y ADN", "De la UNAM para HPLC y ADN"],
    ["LABORATORIO (CARMINLAB) DE CO2, 3D Y RMN", "Laboratorio (CARMINLAB) de CO2, 3D y RMN"],
    ["FITOFARMACOLOGíA", "Fitofarmacología"],
    ["LABORATORIO DE POZOS, AGUA Y SUELO.", "Laboratorio de Pozos, Agua y Suelo."],
    ["123 --", "123 --"],
    ["   ", ""],
  ])("convierte %s", (entrada, salida) => expect(titulo(entrada)).toBe(salida));
  it("sólo convierte desde el 85 % de mayúsculas", () => {
    expect(titulo("ABCDEFGHIJKLMNOqrstUV")).toBe("ABCDEFGHIJKLMNOqrstUV");
    expect(titulo("ABCDEFGHIJKLMNOPQrst")).toBe("Abcdefghijklmnopqrst");
  });
});
