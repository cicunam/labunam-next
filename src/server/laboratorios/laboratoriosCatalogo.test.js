// LabUNAM
// Pruebas unitarias
// laboratoriosCatalogo.test (carga, caché y armado del catálogo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { grupos } from "../../lib/grupos/grupos";

// Servicios
import { assembleCatalog } from "./laboratoriosCatalogo";

// Datos de prueba
import { createTestData, createLaboratorioRow } from "@datosPrueba/catalogo";

// Simulaciones
// La conexión se sustituye: cada consulta responde con los datos de prueba según su tabla.
const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn() }));
vi.mock("../config/dbconnection.js", () => ({ query: queryMock }));
beforeEach(() => {
  vi.resetModules();
  queryMock.mockReset();
  const datos = createTestData();
  queryMock.mockImplementation(async (sql) => {
    if (sql.includes("FROM r_seccion1")) {
      return datos.filas;
    }
    if (sql.includes("FROM catDisiplina")) {
      return datos.disciplinas;
    }
    throw new Error("Consulta inesperada");
  });
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

// Pruebas
describe("catálogo y caché", () => {
  it("consulta laboratorios con sus relaciones y el catálogo de disciplinas", async () => {
    const { buildCatalog } = await import("./laboratoriosCatalogo");
    const catalogo = await buildCatalog();
    expect(catalogo.laboratorios).toHaveLength(3);
    expect(queryMock).toHaveBeenCalledTimes(2);
    const sql = queryMock.mock.calls[0][0];
    expect(sql).toContain("s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)");
    expect(sql).toContain("s.dis38");
    // Si el laboratorio no declara estado, se usa el de su dependencia.
    expect(sql).toContain("COALESCE(NULLIF(s.entidad, 0), d.idEstado)");
    // Las listas usan JSON_ARRAYAGG: GROUP_CONCAT truncaría las listas largas.
    expect(sql).toContain("JSON_ARRAYAGG");
    expect(sql).not.toContain("GROUP_CONCAT");
    expect(sql).not.toContain("SELECT *");
  });
  it("comparte una carga concurrente y reutiliza la copia durante 600 segundos", async () => {
    const { loadCatalog } = await import("./laboratoriosCatalogo");
    const [primera, segunda] = await Promise.all([loadCatalog(), loadCatalog()]);
    expect(segunda).toBe(primera);
    vi.advanceTimersByTime(599_999);
    expect(await loadCatalog()).toBe(primera);
    expect(queryMock).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(1);
    expect(await loadCatalog()).not.toBe(primera);
    expect(queryMock).toHaveBeenCalledTimes(4);
  });
  it("respeta la duración configurada", async () => {
    vi.stubEnv("LABUNAM_CATALOGO_SEGUNDOS", "5");
    const { loadCatalog } = await import("./laboratoriosCatalogo");
    await loadCatalog();
    vi.advanceTimersByTime(5000);
    await loadCatalog();
    expect(queryMock).toHaveBeenCalledTimes(4);
  });
  it("sirve la copia vencida si falla la base y vuelve a intentarlo", async () => {
    const { loadCatalog } = await import("./laboratoriosCatalogo");
    const copia = await loadCatalog();
    vi.advanceTimersByTime(600_000);
    queryMock.mockRejectedValueOnce(new Error("Fallo simulado"));
    expect(await loadCatalog()).toBe(copia);
    expect(await loadCatalog()).not.toBe(copia);
  });
  it("devuelve un error público sin detalles internos si no hay copia", async () => {
    const { loadCatalog } = await import("./laboratoriosCatalogo");
    queryMock.mockRejectedValue(new Error("Detalle interno de prueba"));
    await expect(loadCatalog()).rejects.toThrow("El catálogo no está disponible en este momento.");
  });
});
describe("armado del catálogo", () => {
  it("corrige acentos y nombres históricos de la sede", () => {
    const catalogo = assembleCatalog(createTestData());
    expect(catalogo.laboratorios.find((lab) => lab.idLab === 1)?.sedeNombre).toBe(
      "Ciudad de México",
    );
    expect(catalogo.sedes).toEqual([
      { clave: "ciudad-de-mexico", etiqueta: "Ciudad de México", total: 2 },
      { clave: "queretaro", etiqueta: "Querétaro", total: 1 },
    ]);
  });
  it("deduplica servicios y equipos sin acentos ni mayúsculas", () => {
    const lab = assembleCatalog(createTestData()).laboratorios.find((lab) => lab.idLab === 1);
    expect(lab.equipos).toEqual(["Microscopio óptico"]);
    expect(lab.servicios).toEqual(["Microscopía óptica"]);
    expect(lab.indice).toContain("microscopia optica");
    expect(lab.distinciones).toEqual([
      "Certificación: ISO 9001:2015 · Organismo de prueba (vigencia 2020)",
    ]);
    expect(lab.ubicacion).toBe("Calle de Prueba 10, Municipio de Prueba, C.P. 01234");
    expect(lab.mapa).toBe("https://www.google.com/maps?q=19.3,-99.2");
    expect(lab.sitio).toBe("http://example.org/");
  });
  it("construye grupos, perfiles, distinciones y micrositio", () => {
    const lab = assembleCatalog(createTestData()).laboratorios.find((lab) => lab.idLab === 2);
    expect(lab.grupos).toEqual(["fisica", "materiales"]);
    expect(lab.perfil).toEqual(["servicios", "basica"]);
    expect(lab.distinciones).toEqual(["Acreditación: Acreditación de prueba"]);
    expect(lab.acreditado).toBe(true);
    expect(lab.micrositio).toBe(true);
    expect(lab.sitio).toBe("https://labunam.unam.mx/micrositio/index.php?il=2");
  });
  it("respeta entidades corregidas y excluye tipos de prueba", () => {
    const datos = createTestData();
    datos.filas[0].dependenciaTitulo = "Centro de Pruebas Ópticas";
    datos.filas.push(createLaboratorioRow({ idLab: 99, idTpLab: 0 }));
    const catalogo = assembleCatalog(datos);
    expect(catalogo.laboratorios).toHaveLength(3);
    expect(catalogo.laboratorios.find((lab) => lab.idLab === 1)?.entidad).toBe(
      "Centro de Pruebas Ópticas",
    );
  });
  it("tolera campos vacíos y enlaces no navegables", () => {
    const datos = createTestData();
    datos.filas = [
      createLaboratorioRow({
        estado: null,
        calleNum: null,
        colonia: "0",
        muniDeleg: "",
        cp: 0,
        latitud: 0,
        longitud: null,
        webLab: "javascript:alert(1)",
        fecha: null,
      }),
    ];
    const lab = assembleCatalog(datos).laboratorios[0];
    expect([lab.sede, lab.sedeNombre, lab.ubicacion, lab.mapa, lab.sitio, lab.fecha]).toEqual([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  });
  it("usa claves únicas y conserva especialidades con cero laboratorios", () => {
    const datos = createTestData();
    datos.disciplinas.push({ idDis: 36, disiplina: "QUÍMICA" });
    const catalogo = assembleCatalog(datos);
    for (const opciones of [catalogo.sedes, catalogo.disciplinas]) {
      expect(new Set(opciones.map((opcion) => opcion.clave)).size).toBe(opciones.length);
    }
    expect(catalogo.disciplinas.find((opcion) => opcion.clave === "quimica")?.total).toBe(0);
  });
  it("sugiere disciplinas y equipos presentes en al menos tres laboratorios", () => {
    const catalogo = assembleCatalog(createTestData());
    expect(catalogo.sugerencias).toEqual(["Física", "Materiales", "Microscopio Óptico"]);
    expect(catalogo.sugerencias).not.toContain("Difractómetro");
    expect(catalogo.sugerencias).not.toContain("Laboratorio de Microscopía");
  });
  it("limita los equipos sugeridos a 60 y no cuenta duplicados del mismo laboratorio", () => {
    const datos = createTestData();
    for (const fila of datos.filas) {
      fila.equipos = Array.from({ length: 65 }, (_, i) => ({
        nombre: `Equipo ${i}`,
        tpPruebasServicio: null,
      }));
    }
    datos.filas[0].equipos.push(
      ...Array.from({ length: 4 }, () => ({
        nombre: "Equipo único",
        tpPruebasServicio: null,
      })),
    );
    const catalogo = assembleCatalog(datos);
    expect(catalogo.sugerencias).toHaveLength(62);
    expect(catalogo.sugerencias).not.toContain("Equipo único");
  });
  it("usa equipos y distinciones en el orden en que llegan de MySQL", () => {
    const datos = createTestData();
    datos.filas[0].equipos = [
      { nombre: "Espectrómetro", tpPruebasServicio: "Espectroscopía" },
      { nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía óptica" },
    ];
    datos.filas[0].certificaciones = [
      { nombre: "Antigua", organismo: null, fFin: "2015-01-01" },
      { nombre: "Reciente", organismo: null, fFin: "2024-01-01" },
    ];
    const lab = assembleCatalog(datos).laboratorios.find((lab) => lab.idLab === 1);
    expect(lab.equipos).toEqual(["Espectrómetro", "Microscopio óptico"]);
    expect(lab.servicios).toEqual(["Espectroscopía", "Microscopía óptica"]);
    expect(lab.distinciones).toEqual([
      "Certificación: Antigua (vigencia 2015)",
      "Certificación: Reciente (vigencia 2024)",
    ]);
  });
  it("tolera laboratorios sin equipos ni distinciones", () => {
    const datos = createTestData();
    datos.filas = [createLaboratorioRow({ equipos: null, certificaciones: null })];
    const lab = assembleCatalog(datos).laboratorios[0];
    expect([lab.equipos, lab.servicios, lab.distinciones]).toEqual([[], [], []]);
    expect([lab.certificado, lab.acreditado]).toEqual([false, false]);
  });
  it("mapea una sola vez las 38 disciplinas a las diez áreas", () => {
    expect(grupos).toHaveLength(10);
    expect(grupos.flatMap((grupo) => grupo.disciplinas).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 38 }, (_, i) => i + 1),
    );
  });
});
