// LabUNAM
// Pruebas unitarias
// solicitudes.test (secciones, coincidencias y reglas del formulario de solicitud)
// Ángelo M

// Dependencias
import { describe, expect, it } from "vitest";
import {
  RULES,
  TIPOS_SOLICITANTE,
  TIPOS_SOLICITUD,
  findOption,
  isUnam,
  requiresState,
  sectionFor,
  findLaboratorio,
  laboratorioLabel,
} from "./solicitudes";
import { catalogosEjemplo, laboratoriosEjemplo } from "@datosPrueba/solicitudes";

// Pruebas
// Reproduce cómo el navegador evalúa `pattern`: valor completo y bandera v.
const cumple = (regla, valor) => new RegExp(`^(?:${regla.pattern})$`, "v").test(valor);
describe("secciones", () => {
  it("asocia cada tipo con sus campos adicionales", () => {
    expect(sectionFor(TIPOS_SOLICITANTE, "1")).toBeNull();
    expect(sectionFor(TIPOS_SOLICITANTE, "4")).toBe("institucion");
    expect(sectionFor(TIPOS_SOLICITANTE, "5")).toBe("institucion");
    expect(sectionFor(TIPOS_SOLICITUD, "1")).toBe("analisis");
    expect(sectionFor(TIPOS_SOLICITUD, "")).toBeNull();
  });
});
describe("coincidencias", () => {
  it("acepta el nombre escrito sin acentos ni mayúsculas", () => {
    expect(findOption(catalogosEjemplo.paises, "  mexico ")?.clave).toBe("MEX");
    expect(findOption(catalogosEjemplo.paises, "Méx")).toBeNull();
    expect(findOption(catalogosEjemplo.paises, "")).toBeNull();
  });
  it("muestra estados sólo para México y Estados Unidos", () => {
    expect(requiresState("MEX")).toBe(true);
    expect(requiresState("USA")).toBe(true);
    expect(requiresState("ESP")).toBe(false);
  });
  it("reconoce a la UNAM para pedir la dependencia", () => {
    expect(isUnam("universidad nacional autonoma de mexico")).toBe(true);
    expect(isUnam("Universidad de demostración")).toBe(false);
  });
});
describe("reglas", () => {
  it.each(["María José", "O'Connor", "Ruiz-Esparza", "Müller", "Ma. Elena"])(
    "acepta el nombre %s",
    (valor) => expect(cumple(RULES.nombre, valor)).toBe(true),
  );
  it.each(["Ana2", "<script>", "ana@correo"])("rechaza el nombre %s", (valor) =>
    expect(cumple(RULES.nombre, valor)).toBe(false),
  );
  it("acepta teléfonos sólo con dígitos", () => {
    expect(cumple(RULES.telefono, "5556223000")).toBe(true);
    expect(cumple(RULES.telefono, "55 5622")).toBe(false);
  });
  it("acepta nombres de organización con signos básicos", () => {
    expect(cumple(RULES.organizacion, "Pérez & Asociados, S.A.")).toBe(true);
    expect(cumple(RULES.organizacion, "<b>Empresa</b>")).toBe(false);
  });
});
describe("laboratorio de interés", () => {
  it("usa nombre y entidad como texto de la sugerencia", () => {
    expect(laboratorioLabel(laboratoriosEjemplo[0])).toBe(
      "Laboratorio de Microscopía — Instituto de Demostración",
    );
    expect(laboratorioLabel({ nombre: "Sin entidad", entidad: "" })).toBe("Sin entidad");
  });
  it("distingue laboratorios con el mismo nombre por su entidad", () => {
    expect(
      findLaboratorio(laboratoriosEjemplo, "laboratorio de difraccion — facultad de ejemplo")
        ?.idLab,
    ).toBe(26);
    expect(findLaboratorio(laboratoriosEjemplo, "Laboratorio de Difracción")).toBeNull();
  });
  it("acepta sólo el nombre cuando no se repite", () => {
    expect(findLaboratorio(laboratoriosEjemplo, "laboratorio de microscopia")?.idLab).toBe(18);
    expect(findLaboratorio(laboratoriosEjemplo, "")).toBeNull();
  });
});
