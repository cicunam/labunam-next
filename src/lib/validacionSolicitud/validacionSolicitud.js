// LabUNAM
// Utilidades compartidas
// validacionSolicitud (validación en servidor de los campos del formulario de solicitud)
// Ángelo M

// Dependencias
import {
  CERTIFICACIONES,
  RULES,
  TAMANOS_EMPRESA,
  TIEMPOS_ESPERA,
  TIEMPO_CON_DIAS,
  TIPOS_SOLICITANTE,
  TIPOS_SOLICITUD,
  isUnam,
  normalizeTextValue,
  requiresState,
  sectionFor,
  textError,
} from "../solicitudes/solicitudes";

// Constantes
const DIGITS = /^[0-9]+$/;
// Columnas de la tabla de solicitudes que llena el formulario; lo no aplicable queda en null.
const COLUMNS = [
  "nombre",
  "apellido1",
  "apellido2",
  "correo",
  "telefono",
  "id_pais",
  "id_estado",
  "id_tipo_solicitante",
  "organizacion",
  "tipo_empresa",
  "id_institucion",
  "institucion_otra",
  "id_dependencia",
  "id_cargo",
  "tipo_solicitante_otro",
  "id_tipo_solicitud",
  "descripcion",
  "id_tipo_muestra",
  "norma_lineamiento",
  "id_tiempo_espera",
  "dias_respuesta",
  "objetivos",
  "certificado_requerido",
  "equipo_especifico",
  "id_tipo_colaboracion",
  "id_laboratorio_micrositio",
];
// Nombres que puede enviar el formulario; el laboratorio llega como id_laboratorio.
export const FORM_FIELDS = [
  ...COLUMNS.filter((column) => column !== "id_laboratorio_micrositio"),
  "id_laboratorio",
];

// Definición del módulo
// Devuelve { valid, errors, data }: errors usa los nombres de los campos y data, sólo si todo
// es válido, trae exactamente las columnas por insertar.
export function validateRequest(
  input, // Object - Campos recibidos, por ejemplo Object.fromEntries(formData)
  catalogs, // Object - { publicos, instituciones } de loadRequestCatalogs y laboratorios { idLab } del catálogo
) {
  const errors = {};
  const read = createReader(input ?? {}, errors);
  const data = Object.fromEntries(COLUMNS.map((column) => [column, null]));
  const { publicos, instituciones, laboratorios } = catalogs;

  data.nombre = read.text("nombre", RULES.nombre, { required: true });
  data.apellido1 = read.text("apellido1", RULES.nombre, { required: true });
  data.apellido2 = read.text("apellido2", RULES.nombre);
  data.correo = read.text("correo", RULES.correo, { required: true });
  data.telefono = read.text("telefono", RULES.telefono, { required: true });
  data.id_pais = read.option("id_pais", ids(publicos.paises), { required: true });
  if (data.id_pais && requiresState(data.id_pais)) {
    data.id_estado = toNumber(read.option("id_estado", ids(publicos.estados[data.id_pais] ?? [])));
  }
  validateRequester(read, data, publicos, instituciones);
  validateDetails(read, data, publicos);
  // Vacío significa «necesito orientación»; con valor, debe ser un laboratorio del catálogo.
  data.id_laboratorio_micrositio = toNumber(
    read.option("id_laboratorio", new Set(laboratorios.map(({ idLab }) => String(idLab)))),
  );

  const valid = Object.keys(errors).length === 0;
  return { valid, errors, data: valid ? data : null };
}

// Utilidades

// Sólo se leen los campos de la sección que corresponde al tipo elegido; el resto se descarta.
function validateRequester(
  read, // Object - Lector creado por createReader
  data, // Object - Columnas en construcción
  publicos, // Object - Catálogos públicos
  instituciones, // Array - Instituciones vigentes
) {
  data.id_tipo_solicitante = toNumber(
    read.option("id_tipo_solicitante", ids(TIPOS_SOLICITANTE), { required: true }),
  );
  const section = sectionFor(TIPOS_SOLICITANTE, String(data.id_tipo_solicitante));
  if (section === "empresa" || section === "sociedad") {
    data.organizacion = read.text("organizacion", RULES.organizacion, { required: true });
  }
  if (section === "empresa") {
    data.tipo_empresa = read.option("tipo_empresa", ids(TAMANOS_EMPRESA));
  }
  if (section === "otro") {
    data.tipo_solicitante_otro = read.text("tipo_solicitante_otro", RULES.organizacion, {
      required: true,
    });
  }
  if (section !== "institucion") {
    return;
  }
  // Sin clave del catálogo, la institución escrita a mano es obligatoria.
  if (read.isEmpty("id_institucion")) {
    data.institucion_otra = read.text("institucion_otra", RULES.organizacion, { required: true });
  } else {
    const clave = read.option("id_institucion", ids(instituciones));
    data.id_institucion = toNumber(clave);
    if (isUnam(instituciones.find((institucion) => institucion.clave === clave)?.nombre)) {
      data.id_dependencia = read.option("id_dependencia", ids(publicos.dependencias));
    }
  }
  data.id_cargo = toNumber(read.option("id_cargo", ids(publicos.cargos)));
}

function validateDetails(
  read, // Object - Lector creado por createReader
  data, // Object - Columnas en construcción
  publicos, // Object - Catálogos públicos
) {
  data.id_tipo_solicitud = toNumber(
    read.option("id_tipo_solicitud", ids(TIPOS_SOLICITUD), { required: true }),
  );
  const section = sectionFor(TIPOS_SOLICITUD, String(data.id_tipo_solicitud));
  if (!section) {
    return;
  }
  data.descripcion = read.text("descripcion", RULES.descripcion, {
    required: true,
    multiline: true,
  });
  if (section === "colaboracion") {
    data.id_tipo_colaboracion = toNumber(
      read.option("id_tipo_colaboracion", ids(publicos.tiposColaboracion)),
    );
  }
  if (section !== "analisis") {
    return;
  }
  data.id_tipo_muestra = toNumber(read.option("id_tipo_muestra", ids(publicos.tiposMuestra)));
  data.norma_lineamiento = read.text("norma_lineamiento", RULES.norma);
  data.id_tiempo_espera = toNumber(read.option("id_tiempo_espera", ids(TIEMPOS_ESPERA)));
  if (String(data.id_tiempo_espera) === TIEMPO_CON_DIAS) {
    data.dias_respuesta = read.integer("dias_respuesta", RULES.dias, { required: true });
  }
  data.objetivos = read.text("objetivos", RULES.descripcion, { multiline: true });
  data.certificado_requerido = toNumber(read.option("certificado_requerido", ids(CERTIFICACIONES)));
  data.equipo_especifico = read.text("equipo_especifico", RULES.descripcion, { multiline: true });
}

// Crea las funciones que leen y validan cada campo y anotan sus errores.
function createReader(
  input, // Object - Campos recibidos
  errors, // Object - Errores por campo; se modifica al fallar una regla
) {
  // Sólo se aceptan cadenas: FormData puede traer archivos y un objeto arbitrario cualquier cosa.
  const raw = (field) => (typeof input[field] === "string" ? input[field] : "");
  const fail = (field, message) => {
    errors[field] = message;
    return null;
  };
  return {
    isEmpty: (field) => !raw(field).trim(),
    // Mismas reglas y misma normalización que el formulario (textError de solicitudes).
    text(field, rule, { required = false, multiline = false } = {}) {
      const value = normalizeTextValue(raw(field), multiline);
      if (!value) {
        return required ? fail(field, "Este campo es obligatorio.") : null;
      }
      const error = textError(value, rule, multiline);
      return error ? fail(field, error) : value;
    },
    option(field, allowed, { required = false } = {}) {
      const value = raw(field).trim();
      if (!value) {
        return required ? fail(field, "Elige una opción.") : null;
      }
      return allowed.has(value) ? value : fail(field, "Elige una opción válida.");
    },
    integer(field, { min, max }, { required = false } = {}) {
      const value = raw(field).trim();
      if (!value) {
        return required ? fail(field, "Este campo es obligatorio.") : null;
      }
      const number = DIGITS.test(value) ? Number(value) : NaN;
      return number >= min && number <= max
        ? number
        : fail(field, `Escribe un número entero entre ${min} y ${max}.`);
    },
  };
}

// Claves válidas de una lista de opciones fijas ({ id }) o de catálogo ({ clave }).
function ids(
  options, // Array - Opciones
) {
  return new Set(options.map((option) => option.id ?? option.clave));
}

function toNumber(
  value, // String | null - Clave validada
) {
  return value === null ? null : Number(value);
}
