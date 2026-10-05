import { expect, it } from "vitest";
import { seleccionarFotos } from "./seleccionFotos";
const foto = (nombre: string, modificado = 0) => ({ nombre, modificado });
it("ordena carruseles, fondo, infraestructura y antecedentes; limita a tres", () => {
  expect(seleccionarFotos([foto("Antece.png"), foto("Infra.JPG"), foto("Fondo.jpg"), foto("Carrusel2.png"), foto("Carrusel1.jpg")]).map((f) => f.nombre)).toEqual(["Carrusel1.jpg", "Carrusel2.png", "Fondo.jpg"]);
});
it("conserva la resubida más reciente aunque el archivo antiguo se haya copiado después", () => {
  expect(seleccionarFotos([foto("Carrusel1.jpg", Date.now()), foto("1773274988_Carrusel1.png"), foto("1773274999_Carrusel1.JPG")]).map((f) => f.nombre)).toEqual(["1773274999_Carrusel1.JPG"]);
});
it("compara marcas de segundos y milisegundos y descarta otros formatos", () => {
  expect(seleccionarFotos([foto("1773274999000_Carrusel2.jpg"), foto("1773274988_Carrusel2.jpg"), foto("datos.pdf"), foto("foto.svg")]).map((f) => f.nombre)).toEqual(["1773274999000_Carrusel2.jpg"]);
});
it("acepta nombres sin prefijo, extensiones mixtas y fechas del archivo en empates", () => {
  expect(seleccionarFotos([foto("Carrusel 1.JPG", 1), foto("Carrusel1.png", 2), foto("otra.webp")]).map((f) => f.nombre)).toEqual(["Carrusel1.png", "otra.webp"]);
});
