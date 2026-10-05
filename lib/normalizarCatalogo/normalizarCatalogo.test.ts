import { describe, expect, it } from "vitest";
import { normalizarCatalogo } from "./normalizarCatalogo";
import { datosDePrueba, filaLaboratorio } from "../catalogo/catalogo.fixtures";
import { grupos } from "../grupos/grupos";

describe("normalizarCatalogo", () => {
  it("recupera la sede de la dependencia y corrige acentos", () => {
    const catalogo = normalizarCatalogo(datosDePrueba());
    expect(catalogo.laboratorios.find((lab) => lab.idLab === 1)?.sedeNombre).toBe("Ciudad de México");
    expect(catalogo.sedes).toEqual([
      { clave: "ciudad-de-mexico", etiqueta: "Ciudad de México", total: 2 },
      { clave: "queretaro", etiqueta: "Querétaro", total: 1 },
    ]);
  });
  it("deduplica servicios y equipos sin acentos ni mayúsculas", () => {
    const lab = normalizarCatalogo(datosDePrueba()).laboratorios.find((lab) => lab.idLab === 1)!;
    expect(lab.equipos).toEqual(["Microscopio óptico"]);
    expect(lab.servicios).toEqual(["Microscopía óptica"]);
    expect(lab.indice).toContain("microscopia optica");
    expect(lab.distinciones).toEqual(["Certificación: ISO 9001:2015 · Organismo de prueba (vigencia 2020)"]);
    expect(lab.ubicacion).toBe("Calle de Prueba 10, Municipio de Prueba, C.P. 01234");
    expect(lab.mapa).toBe("https://www.google.com/maps?q=19.3,-99.2");
    expect(lab.sitio).toBe("http://example.org/");
  });
  it("construye grupos, perfiles, distinciones y micrositio", () => {
    const lab = normalizarCatalogo(datosDePrueba()).laboratorios.find((lab) => lab.idLab === 2)!;
    expect(lab.grupos).toEqual(["fisica", "materiales"]);
    expect(lab.perfil).toEqual(["servicios", "basica"]);
    expect(lab.distinciones).toEqual(["Acreditación: Acreditación de prueba"]);
    expect(lab.acreditado).toBe(true);
    expect(lab.micrositio).toBe(true);
    expect(lab.sitio).toBe("https://labunam.unam.mx/micrositio/index.php?il=2");
  });
  it("respeta entidades corregidas y excluye tipos de prueba", () => {
    const datos = datosDePrueba();
    datos.filas[0].dependenciaTitulo = "Centro de Pruebas Ópticas";
    datos.filas.push(filaLaboratorio({ idLab: 99, idTpLab: 0 }));
    const catalogo = normalizarCatalogo(datos);
    expect(catalogo.laboratorios).toHaveLength(3);
    expect(catalogo.laboratorios.find((lab) => lab.idLab === 1)?.entidad).toBe("Centro de Pruebas Ópticas");
  });
  it("tolera campos vacíos y enlaces no navegables", () => {
    const datos = datosDePrueba();
    datos.filas = [filaLaboratorio({ idEstado: 0, idEstadoDepen: 0, calleNum: null, colonia: "0", muniDeleg: "", cp: 0, latitud: 0, longitud: null, webLab: "javascript:alert(1)", fecha: null })];
    const lab = normalizarCatalogo(datos).laboratorios[0];
    expect([lab.sede, lab.sedeNombre, lab.ubicacion, lab.mapa, lab.sitio, lab.fecha]).toEqual(["", "", "", "", "", ""]);
  });
  it("usa claves únicas y conserva especialidades con cero laboratorios", () => {
    const datos = datosDePrueba();
    datos.disciplinas.push({ idDis: 36, disiplina: "QUÍMICA" });
    const catalogo = normalizarCatalogo(datos);
    for (const opciones of [catalogo.sedes, catalogo.disciplinas]) expect(new Set(opciones.map((opcion) => opcion.clave)).size).toBe(opciones.length);
    expect(catalogo.disciplinas.find((opcion) => opcion.clave === "quimica")?.total).toBe(0);
  });
  it("sugiere disciplinas y equipos presentes en al menos tres laboratorios", () => {
    const catalogo = normalizarCatalogo(datosDePrueba());
    expect(catalogo.sugerencias).toEqual(["Física", "Materiales", "Microscopio Óptico"]);
    expect(catalogo.sugerencias).not.toContain("Difractómetro");
    expect(catalogo.sugerencias).not.toContain("Laboratorio de Microscopía");
  });
  it("limita los equipos sugeridos a 60 y no cuenta duplicados del mismo laboratorio", () => {
    const datos = datosDePrueba();
    datos.equipos = Array.from({ length: 65 }, (_, i) => [1, 2, 3].map((idLab) => ({ idLab, nombre: `Equipo ${i}`, tpPruebasServicio: null }))).flat();
    datos.equipos.push(...Array.from({ length: 4 }, () => ({ idLab: 1, nombre: "Equipo único", tpPruebasServicio: null })));
    const catalogo = normalizarCatalogo(datos);
    expect(catalogo.sugerencias).toHaveLength(62);
    expect(catalogo.sugerencias).not.toContain("Equipo único");
  });
  it("mapea una sola vez las 38 disciplinas a las diez áreas", () => {
    expect(grupos).toHaveLength(10);
    expect(grupos.flatMap((grupo) => grupo.disciplinas).sort((a, b) => a - b)).toEqual(Array.from({ length: 38 }, (_, i) => i + 1));
  });
});
