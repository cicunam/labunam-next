import { afterEach, describe, expect, it, vi } from "vitest";
import { opcionesBusqueda, guardarReciente, leerRecientes } from "./sugerencias";
import { prepararFiltros } from "./filtros";
import { normalizarCatalogo } from "./normalizarCatalogo";
import { datosDePrueba } from "./catalogo.fixtures";
import { filtrar, valoresDe } from "./buscador";
import { fotosDe } from "./fotos";
import { cifras, urlCatalogo } from "./presentacion";

afterEach(() => vi.unstubAllGlobals());
describe("búsquedas recientes", () => {
  it("completa sin acentos y no duplica recientes entre sugerencias", () => {
    expect(opcionesBusqueda("micro", ["Microscopía", "Microscopio"], ["microscopia"])).toEqual([{ texto: "microscopia", reciente: true }, { texto: "Microscopio", reciente: false }]);
    expect(opcionesBusqueda("", [], ["Uno", "Dos"])).toHaveLength(2);
  });
  it("guarda como máximo cinco, mueve la última al frente y tolera almacenamiento inválido", () => {
    let valor = "malformado";
    vi.stubGlobal("localStorage", { getItem: () => valor, setItem: (_: string, dato: string) => { valor = dato; } });
    expect(leerRecientes()).toEqual([]);
    ["uno", "dos", "tres", "cuatro", "cinco", "seis", "DÓS"].forEach(guardarReciente);
    expect(leerRecientes()).toEqual(["DÓS", "seis", "cinco", "cuatro", "tres"]);
    guardarReciente("  "); expect(leerRecientes()).toHaveLength(5);
  });
  it("sigue buscando cuando el navegador bloquea el almacenamiento", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); } });
    expect(leerRecientes()).toEqual([]); expect(() => guardarReciente("Microscopía")).not.toThrow();
  });
});
it("calcula los cinco ejes respetando los otros filtros", () => {
  const catalogo = normalizarCatalogo(datosDePrueba());
  const criterios = { q: "microscopia", tipo: "nacionales", disciplina: "biologia" };
  const resultado = prepararFiltros(catalogo, criterios);
  expect(resultado.total).toBe(filtrar(catalogo.laboratorios, criterios).length);
  expect(resultado.filtros).toHaveLength(5);
  for (const filtro of resultado.filtros) for (const opcion of filtro.opciones) {
    expect(opcion.total).toBe(filtrar(catalogo.laboratorios, { ...criterios, [filtro.eje]: "" }).filter((lab) => valoresDe(lab, filtro.eje).includes(opcion.clave)).length);
  }
});
it("conserva parámetros y elimina sólo el chip solicitado", () => {
  expect(urlCatalogo({ q: "rayos x", tipo: "nacionales" }, { tipo: "" })).toBe("/laboratorios?q=rayos+x");
  expect(cifras(0, 1)).toBe("1 equipo"); expect(cifras(0, 0)).toBe("");
});
it("usa tres fotos como máximo y ofrece respaldo determinista", () => {
  expect(fotosDe(7, { "7": [{ src: "/fotos/7.webp", srcset: "/fotos/7.webp 640w" }] })[0]).toEqual({ src: "/fotos/7.webp", srcSet: "/fotos/7.webp 640w", alt: "" });
  expect(fotosDe(1, {})).toHaveLength(3); expect(fotosDe(1, {})).toEqual(fotosDe(1, {}));
});

it("rota los respaldos optimizados conservando su srcset", () => {
  const respaldo = [0, 1, 2].map((n) => ({ src: `/fotos/respaldo/${n}.webp`, srcset: `/fotos/respaldo/${n}.webp 480w` }));
  expect(fotosDe(4, { respaldo })[0]).toEqual({ src: "/fotos/respaldo/1.webp", srcSet: "/fotos/respaldo/1.webp 480w", alt: "" });
});
