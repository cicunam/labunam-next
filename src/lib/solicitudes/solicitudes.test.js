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
  normalizeTextValue,
  requiresState,
  sectionFor,
  textError,
} from "./solicitudes";
import { catalogosEjemplo } from "@datosPrueba/solicitudes";

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
describe("textos", () => {
  it("normaliza igual que el servidor: una línea colapsa espacios y un texto largo conserva saltos", () => {
    expect(normalizeTextValue("  Ana   María ")).toBe("Ana María");
    expect(normalizeTextValue(" uno\r\ndos ", true)).toBe("uno\ndos");
  });
  it("mide la longitud sobre el valor normalizado y en caracteres", () => {
    // Con espacios sobrantes el texto crudo tiene 3 caracteres, pero el normalizado sólo 1.
    expect(textError(" A ", RULES.nombre)).toBe("Debe tener entre 2 y 50 caracteres.");
    expect(textError("ñ".repeat(255), RULES.descripcion, true)).toBeNull();
  });
  it("exige dominio con extensión en el correo y no lo trata como texto libre", () => {
    expect(textError("a@b", RULES.correo)).toBe("Escribe un correo electrónico válido.");
    expect(textError("www.persona@ejemplo.com", RULES.correo)).toBeNull();
  });
  it("rechaza enlaces y etiquetas en textos libres", () => {
    expect(textError("Ver www.ejemplo.com", RULES.descripcion)).toBe(
      "No incluyas enlaces ni etiquetas HTML.",
    );
    expect(textError("Empresa <b>", RULES.organizacion)).toBe(
      "No incluyas enlaces ni etiquetas HTML.",
    );
  });
  it("no marca error en un campo vacío", () => {
    expect(textError("   ", RULES.nombre)).toBeNull();
  });
});
