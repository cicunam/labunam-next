// LabUNAM
// Pruebas unitarias
// micrositio.test (frases obtenidas del HTML del micrositio)
// Ivonne Aviles <daviles@cic.unam.mx>

// Dependencias
import { expect, it } from "vitest";
import { htmlToParagraphs } from "./micrositio";

// Pruebas
it("separa párrafos y elementos de lista", () => {
  expect(
    htmlToParagraphs("<p><strong>Instituto de F&iacute;sica</strong></p><ul><li>Microscop&iacute;a</li></ul>"),
  ).toEqual(["Instituto de Física", "Microscopía"]);
});

it("un campo vacío no produce frases", () => {
  expect(htmlToParagraphs(null)).toEqual([]);
});