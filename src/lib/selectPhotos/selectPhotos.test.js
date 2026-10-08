import { expect, it } from "vitest";
import { selectPhotos } from "./selectPhotos";
const createPhoto = (nombre, modificado = 0) => ({ nombre, modificado });
it("ordena carruseles, fondo, infraestructura y antecedentes; limita a tres", () => {
    expect(selectPhotos([createPhoto("Antece.png"), createPhoto("Infra.JPG"), createPhoto("Fondo.jpg"), createPhoto("Carrusel2.png"), createPhoto("Carrusel1.jpg")]).map((f) => f.nombre)).toEqual(["Carrusel1.jpg", "Carrusel2.png", "Fondo.jpg"]);
});
it("conserva la resubida más reciente aunque el archivo antiguo se haya copiado después", () => {
    expect(selectPhotos([createPhoto("Carrusel1.jpg", Date.now()), createPhoto("1773274988_Carrusel1.png"), createPhoto("1773274999_Carrusel1.JPG")]).map((f) => f.nombre)).toEqual(["1773274999_Carrusel1.JPG"]);
});
it("compara marcas de segundos y milisegundos y descarta otros formatos", () => {
    expect(selectPhotos([createPhoto("1773274999000_Carrusel2.jpg"), createPhoto("1773274988_Carrusel2.jpg"), createPhoto("datos.pdf"), createPhoto("foto.svg")]).map((f) => f.nombre)).toEqual(["1773274999000_Carrusel2.jpg"]);
});
it("acepta nombres sin prefijo, extensiones mixtas y fechas del archivo en empates", () => {
    expect(selectPhotos([createPhoto("Carrusel 1.JPG", 1), createPhoto("Carrusel1.png", 2), createPhoto("otra.webp")]).map((f) => f.nombre)).toEqual(["Carrusel1.png", "otra.webp"]);
});
