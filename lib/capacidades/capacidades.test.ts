import { expect, test } from "vitest";
import { getCapabilities, getCapabilityExcerpt } from "./capacidades";

test("prioriza capacidades coincidentes aunque estén al final del inventario", () => {
  expect(getCapabilities(["Cultivos", "Análisis"], ["Centrífuga", "Microscopio"], ["Microscopio"]))
    .toEqual({ coincide: true, items: [{ texto: "Microscopio", tipo: "Equipo" }] });
});
test("sin coincidencias muestra hasta dos capacidades distintas, primero servicios", () => {
  expect(getCapabilities(["Microscopía", "microscopia"], ["Microscopía", "Centrífuga", "Otro"]).items)
    .toEqual([{ texto: "Microscopía", tipo: "Servicio" }, { texto: "Centrífuga", tipo: "Equipo" }]);
});
test("no inventa capacidades ni marca coincidencias ausentes en el inventario", () => {
  expect(getCapabilities([], [], ["No existe"])).toEqual({ coincide: false, items: [] });
});


test("el fragmento hace visible una coincidencia al final de una descripción larga", () => {
  const texto = "Caracterización de muestras y análisis de estructuras superficiales mediante protocolos especializados para estudios de microscopía avanzada";
  const fragmento = getCapabilityExcerpt(texto, "microscopia");
  expect(fragmento).toContain("microscopía");
  expect(fragmento.startsWith("…")).toBe(true);
});
