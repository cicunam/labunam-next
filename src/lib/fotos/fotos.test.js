// LabUNAM
// Pruebas unitarias
// fotos.test (orden de fotos y logos e ilustraciones de respaldo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { expect, it, test } from "vitest";
import { getPhotos } from "./fotos";

// Pruebas
test("usa el área única y un respaldo general para varias áreas o ninguna", () => {
  expect(getPhotos(1, {}, ["quimica"])[0].src).toContain("/quimica.svg");
  expect(getPhotos(1, {}, ["quimica", "biologia"])[0].src).toContain("/general.svg");
  expect(getPhotos(1, {})).toHaveLength(1);
  expect(getPhotos(1, {})[0].alt).toContain("Sin fotografía disponible");
});
test("prioriza fotografías sobre logos y conserva el logo cuando es la única imagen", () => {
  const fotos = {
    1: [
      { src: "/logo.webp", tipo: "logo" },
      { src: "/foto.webp", tipo: "foto" },
    ],
  };
  expect(getPhotos(1, fotos)[0].src).toBe("/foto.webp");
  expect(getPhotos(2, { 2: [fotos["1"][0]] })[0].tipo).toBe("logo");
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
