import { describe, expect, it } from "vitest";
import { slugify, normalizeText, toTitleCase } from "./texto";

describe("plano", () => {
  it.each([
    ["Microscopía Óptica", "microscopia optica"],
    ["  ÁÉÍÓÚ ÜÑ ÀÈÌÒÙ  ", "aeiou un aeiou"],
    ["", ""],
  ])("normaliza %s", (entrada, salida) => expect(normalizeText(entrada)).toBe(salida));
});

describe("clave", () => {
  it.each([
    ["Ciencias de la Tierra e Ingenierías", "ciencias-de-la-tierra-e-ingenierias"],
    [" ¡QUÍMICA / RMN 3D! ", "quimica-rmn-3d"],
    ["---", ""],
  ])("genera la clave de %s", (entrada, salida) => expect(slugify(entrada)).toBe(salida));
});

describe("titulo", () => {
  it("conserva las siglas indicadas", () => {
    expect(toTitleCase("LABORATORIO NACIONAL HAWC DE RAYOS GAMMA", ["HAWC"])).toBe("Laboratorio Nacional HAWC de Rayos Gamma");
    expect(toTitleCase("CENTRO ABC XYZ DE PRUEBAS", ["ABC-XYZ"])).toBe("Centro ABC XYZ de Pruebas");
  });
  it("respeta la escritura manual", () => {
    expect(toTitleCase("Laboratorio de Nanosensores Biofotónicos")).toBe("Laboratorio de Nanosensores Biofotónicos");
  });
  it.each([
    ["  LABORATORIO   DE\nÓPTICA ", "Laboratorio de Óptica"],
    ["DE LA UNAM PARA HPLC Y ADN", "De la UNAM para HPLC y ADN"],
    ["LABORATORIO (CARMINLAB) DE CO2, 3D Y RMN", "Laboratorio (CARMINLAB) de CO2, 3D y RMN"],
    ["FITOFARMACOLOGíA", "Fitofarmacología"],
    ["LABORATORIO DE POZOS, AGUA Y SUELO.", "Laboratorio de Pozos, Agua y Suelo."],
    ["123 --", "123 --"],
    ["   ", ""],
  ])("convierte %s", (entrada, salida) => expect(toTitleCase(entrada)).toBe(salida));
  it("sólo convierte desde el 85 % de mayúsculas", () => {
    expect(toTitleCase("ABCDEFGHIJKLMNOqrstUV")).toBe("ABCDEFGHIJKLMNOqrstUV");
    expect(toTitleCase("ABCDEFGHIJKLMNOPQrst")).toBe("Abcdefghijklmnopqrst");
  });
});
