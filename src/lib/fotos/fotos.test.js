import { expect, test } from "vitest";
import { getPhotos } from "./fotos";

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
