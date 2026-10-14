// LabUNAM
// Pruebas unitarias
// validacionSolicitud.test (reglas del servidor para cada campo y sección de la solicitud)
// Ángelo M

// Dependencias
import { describe, expect, it } from "vitest";
import { FORM_FIELDS, validateRequest } from "./validacionSolicitud";
import { catalogosEjemplo, institucionesEjemplo } from "@datosPrueba/solicitudes";

// Pruebas
const catalogos = { publicos: catalogosEjemplo, instituciones: institucionesEjemplo };
// Solicitud mínima válida: persona física que pide una capacitación.
const base = {
  nombre: "Persona",
  apellido1: "Ficticia",
  correo: "persona@ejemplo.com",
  telefono: "5512345678",
  id_pais: "ESP",
  id_tipo_solicitante: "1",
  id_tipo_solicitud: "3",
  descripcion: "Capacitación en una técnica de ejemplo.",
};
const validar = (cambios = {}) => validateRequest({ ...base, ...cambios }, catalogos);
describe("solicitud mínima", () => {
  it("acepta los campos obligatorios y deja en null lo que no aplica", () => {
    const { valid, errors, data } = validar();
    expect(errors).toEqual({});
    expect(valid).toBe(true);
    expect(data).toMatchObject({
      nombre: "Persona",
      id_pais: "ESP",
      id_tipo_solicitante: 1,
      id_tipo_solicitud: 3,
      id_estado: null,
      organizacion: null,
      id_laboratorio_micrositio: null,
    });
    expect(Object.keys(data)).toHaveLength(26);
  });
  it("informa cada obligatorio faltante y no devuelve datos", () => {
    const { valid, errors, data } = validateRequest({}, catalogos);
    expect(valid).toBe(false);
    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual([
      "apellido1",
      "correo",
      "id_pais",
      "id_tipo_solicitante",
      "id_tipo_solicitud",
      "nombre",
      "telefono",
    ]);
  });
  it("limpia espacios y conserva saltos de línea en textos largos", () => {
    const { data } = validar({
      nombre: "  María   José ",
      descripcion: " Línea uno\r\nLínea dos ",
    });
    expect(data.nombre).toBe("María José");
    expect(data.descripcion).toBe("Línea uno\nLínea dos");
  });
  it("ignora valores que no son texto", () => {
    expect(validar({ nombre: ["Persona"] }).errors.nombre).toBe("Este campo es obligatorio.");
  });
});
describe("reglas de campos", () => {
  it.each([
    ["nombre", "Ana2", "Sólo letras, espacios, puntos, apóstrofos o guiones"],
    ["nombre", "A", "Debe tener entre 2 y 50 caracteres."],
    ["telefono", "55-1234-5678", "Sólo números, entre 8 y 13 dígitos"],
    ["correo", "persona@", "Escribe un correo electrónico válido."],
    ["descripcion", "Visita https://ejemplo.com", "No incluyas enlaces ni etiquetas HTML."],
    ["descripcion", "<b>hola</b>", "No incluyas enlaces ni etiquetas HTML."],
    ["descripcion", "x".repeat(256), "Debe tener entre 2 y 255 caracteres."],
    ["id_pais", "ZZZ", "Elige una opción válida."],
    ["id_tipo_solicitante", "9", "Elige una opción válida."],
    ["id_laboratorio", "-3", "Escribe un número entero entre 1 y 9007199254740991."],
  ])("rechaza %s = %j", (campo, valor, mensaje) => {
    expect(validar({ [campo]: valor }).errors[campo]).toBe(mensaje);
  });
  it("cuenta caracteres y no bytes", () => {
    expect(validar({ descripcion: "ñ".repeat(255) }).valid).toBe(true);
  });
  it("convierte el laboratorio a la columna del micrositio", () => {
    expect(validar({ id_laboratorio: "18" }).data.id_laboratorio_micrositio).toBe(18);
  });
});
describe("país y estado", () => {
  it("valida el estado sólo para México y Estados Unidos", () => {
    expect(validar({ id_pais: "MEX", id_estado: "2" }).data.id_estado).toBe(2);
    expect(validar({ id_pais: "MEX", id_estado: "51" }).errors.id_estado).toBe(
      "Elige una opción válida.",
    );
    expect(validar({ id_pais: "ESP", id_estado: "2" }).data.id_estado).toBeNull();
  });
});
describe("tipo de solicitante", () => {
  it("exige el nombre de la empresa y valida su tamaño", () => {
    expect(validar({ id_tipo_solicitante: "2" }).errors.organizacion).toBe(
      "Este campo es obligatorio.",
    );
    expect(
      validar({
        id_tipo_solicitante: "2",
        organizacion: "Empresa & Hijos, S.A.",
        tipo_empresa: "Micro",
      }).data,
    ).toMatchObject({ organizacion: "Empresa & Hijos, S.A.", tipo_empresa: "Micro" });
    expect(
      validar({ id_tipo_solicitante: "2", organizacion: "Empresa", tipo_empresa: "Gigante" }).errors
        .tipo_empresa,
    ).toBe("Elige una opción válida.");
  });
  it("descarta campos de secciones que no corresponden", () => {
    const { data } = validar({
      organizacion: "Empresa",
      id_institucion: "1",
      tipo_solicitante_otro: "Otro",
    });
    expect(data).toMatchObject({
      organizacion: null,
      id_institucion: null,
      tipo_solicitante_otro: null,
    });
  });
  it("acepta una institución del catálogo o una escrita a mano, pero no ninguna", () => {
    expect(
      validar({ id_tipo_solicitante: "4", id_institucion: "2", id_cargo: "1" }).data,
    ).toMatchObject({ id_institucion: 2, institucion_otra: null, id_cargo: 1 });
    expect(
      validar({ id_tipo_solicitante: "4", institucion_otra: "Universidad Nueva" }).data,
    ).toMatchObject({ id_institucion: null, institucion_otra: "Universidad Nueva" });
    expect(validar({ id_tipo_solicitante: "4" }).errors).toEqual({
      institucion_otra: "Este campo es obligatorio.",
    });
    expect(validar({ id_tipo_solicitante: "4", id_institucion: "999" }).errors).toEqual({
      id_institucion: "Elige una opción válida.",
    });
  });
  it("acepta la dependencia sólo para la UNAM", () => {
    expect(
      validar({ id_tipo_solicitante: "4", id_institucion: "1", id_dependencia: "10" }).data
        .id_dependencia,
    ).toBe("10");
    expect(
      validar({ id_tipo_solicitante: "4", id_institucion: "1", id_dependencia: "99" }).errors
        .id_dependencia,
    ).toBe("Elige una opción válida.");
    expect(
      validar({ id_tipo_solicitante: "4", id_institucion: "2", id_dependencia: "10" }).data
        .id_dependencia,
    ).toBeNull();
  });
  it("exige especificar el tipo «Otro»", () => {
    expect(validar({ id_tipo_solicitante: "6" }).errors.tipo_solicitante_otro).toBe(
      "Este campo es obligatorio.",
    );
  });
});
describe("tipo de solicitud", () => {
  const analisis = { id_tipo_solicitud: "1", descripcion: "Análisis de una muestra ficticia." };
  it("valida los campos del análisis y descarta los de otras secciones", () => {
    const { data } = validar({
      ...analisis,
      id_tipo_muestra: "2",
      id_tiempo_espera: "1",
      dias_respuesta: "30",
      certificado_requerido: "0",
      objetivos: "Conocer su composición.",
      id_tipo_colaboracion: "1",
    });
    expect(data).toMatchObject({
      id_tipo_muestra: 2,
      id_tiempo_espera: 1,
      dias_respuesta: null,
      certificado_requerido: 0,
      objetivos: "Conocer su composición.",
      id_tipo_colaboracion: null,
    });
  });
  it("exige días entre 4 y 365 cuando el tiempo es mayor a tres días", () => {
    expect(validar({ ...analisis, id_tiempo_espera: "2" }).errors.dias_respuesta).toBe(
      "Este campo es obligatorio.",
    );
    expect(
      validar({ ...analisis, id_tiempo_espera: "2", dias_respuesta: "3" }).errors.dias_respuesta,
    ).toBe("Escribe un número entero entre 4 y 365.");
    expect(
      validar({ ...analisis, id_tiempo_espera: "2", dias_respuesta: "4.5" }).errors.dias_respuesta,
    ).toBe("Escribe un número entero entre 4 y 365.");
    expect(
      validar({ ...analisis, id_tiempo_espera: "2", dias_respuesta: "10" }).data.dias_respuesta,
    ).toBe(10);
  });
  it("valida el tipo de colaboración contra su catálogo", () => {
    expect(
      validar({ id_tipo_solicitud: "2", id_tipo_colaboracion: "2" }).data.id_tipo_colaboracion,
    ).toBe(2);
    expect(
      validar({ id_tipo_solicitud: "2", id_tipo_colaboracion: "8" }).errors.id_tipo_colaboracion,
    ).toBe("Elige una opción válida.");
  });
  it("exige la descripción en todos los tipos", () => {
    for (const tipo of ["1", "2", "3", "4"]) {
      expect(validar({ id_tipo_solicitud: tipo, descripcion: "" }).errors.descripcion).toBe(
        "Este campo es obligatorio.",
      );
    }
  });
});
it("declara los nombres que puede enviar el formulario", () => {
  expect(FORM_FIELDS).toContain("id_laboratorio");
  expect(FORM_FIELDS).not.toContain("id_laboratorio_micrositio");
  expect(FORM_FIELDS).toHaveLength(26);
});
