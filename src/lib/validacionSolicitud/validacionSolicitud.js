import { CERTIFICACIONES, REGLAS, TAMANOS_EMPRESA, TIEMPOS_ESPERA, TIEMPO_CON_DIAS, TIPOS_SOLICITANTE, TIPOS_SOLICITUD, isUnam, requiresState, sectionFor } from "../solicitudes/solicitudes";
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
// Igual que la versión anterior: los textos libres no admiten enlaces ni etiquetas HTML.
const NO_PERMITIDO = /[<>]|https?:\/\/|www\./iu;
const ENTERO = /^[0-9]+$/;
// Columnas de la tabla de solicitudes que llena el formulario; lo no aplicable queda en null.
const COLUMNAS = [
    "nombre", "apellido1", "apellido2", "correo", "telefono", "id_pais", "id_estado",
    "id_tipo_solicitante", "organizacion", "tipo_empresa", "id_institucion", "institucion_otra", "id_dependencia", "id_cargo", "tipo_solicitante_otro",
    "id_tipo_solicitud", "descripcion", "id_tipo_muestra", "norma_lineamiento", "id_tiempo_espera", "dias_respuesta", "objetivos", "certificado_requerido", "equipo_especifico", "id_tipo_colaboracion",
    "id_laboratorio_micrositio",
];
// Nombres que puede enviar el formulario; el laboratorio llega como id_laboratorio.
export const CAMPOS_FORMULARIO = [...COLUMNAS.filter((columna) => columna !== "id_laboratorio_micrositio"), "id_laboratorio"];
const ids = (opciones) => new Set(opciones.map((opcion) => opcion.id ?? opcion.clave));
function createReader(entrada, errores) {
    // Sólo se aceptan cadenas: FormData puede traer archivos y un objeto arbitrario puede traer cualquier cosa.
    const crudo = (campo) => (typeof entrada[campo] === "string" ? entrada[campo] : "");
    const fallar = (campo, mensaje) => { errores[campo] = mensaje; return null; };
    return {
        vacio: (campo) => !crudo(campo).trim(),
        texto(campo, regla, { obligatorio = false, multilinea = false } = {}) {
            const valor = multilinea ? crudo(campo).replace(/\r\n?/gu, "\n").trim() : crudo(campo).replace(/\s+/gu, " ").trim();
            const largo = [...valor].length;
            if (!valor)
                {return obligatorio ? fallar(campo, "Este campo es obligatorio.") : null;}
            if ((regla.minLength && largo < regla.minLength) || (regla.maxLength && largo > regla.maxLength))
                {return fallar(campo, `Debe tener entre ${regla.minLength ?? 1} y ${regla.maxLength} caracteres.`);}
            if (NO_PERMITIDO.test(valor))
                {return fallar(campo, "No incluyas enlaces ni etiquetas HTML.");}
            if (regla.pattern && !new RegExp(`^(?:${regla.pattern})$`, "v").test(valor))
                {return fallar(campo, regla.title ?? "Contiene caracteres no permitidos.");}
            return valor;
        },
        correo(campo) {
            const valor = crudo(campo).trim();
            if (!valor)
                {return fallar(campo, "Este campo es obligatorio.");}
            if (valor.length > REGLAS.correo.maxLength || !CORREO.test(valor))
                {return fallar(campo, "Escribe un correo electrónico válido.");}
            return valor;
        },
        opcion(campo, permitidas, { obligatorio = false } = {}) {
            const valor = crudo(campo).trim();
            if (!valor)
                {return obligatorio ? fallar(campo, "Elige una opción.") : null;}
            return permitidas.has(valor) ? valor : fallar(campo, "Elige una opción válida.");
        },
        entero(campo, { min, max }, { obligatorio = false } = {}) {
            const valor = crudo(campo).trim();
            if (!valor)
                {return obligatorio ? fallar(campo, "Este campo es obligatorio.") : null;}
            const numero = ENTERO.test(valor) ? Number(valor) : NaN;
            return numero >= min && numero <= max ? numero : fallar(campo, `Escribe un número entero entre ${min} y ${max}.`);
        },
    };
}
const toNumber = (valor) => (valor === null ? null : Number(valor));
export function validateRequest(entrada, { publicos, instituciones }) {
    const errores = {};
    const leer = createReader(entrada ?? {}, errores);
    const datos = Object.fromEntries(COLUMNAS.map((columna) => [columna, null]));
    datos.nombre = leer.texto("nombre", REGLAS.nombre, { obligatorio: true });
    datos.apellido1 = leer.texto("apellido1", REGLAS.nombre, { obligatorio: true });
    datos.apellido2 = leer.texto("apellido2", REGLAS.nombre);
    datos.correo = leer.correo("correo");
    datos.telefono = leer.texto("telefono", REGLAS.telefono, { obligatorio: true });
    datos.id_pais = leer.opcion("id_pais", ids(publicos.paises), { obligatorio: true });
    if (datos.id_pais && requiresState(datos.id_pais))
        {datos.id_estado = toNumber(leer.opcion("id_estado", ids(publicos.estados[datos.id_pais] ?? [])));}
    validateRequester(leer, datos, publicos, instituciones);
    validateDetails(leer, datos, publicos);
    datos.id_laboratorio_micrositio = leer.entero("id_laboratorio", { min: 1, max: Number.MAX_SAFE_INTEGER });
    const valido = Object.keys(errores).length === 0;
    return { valido, errores, datos: valido ? datos : null };
}
// Sólo se leen los campos de la sección que corresponde al tipo elegido; el resto se descarta.
function validateRequester(leer, datos, publicos, instituciones) {
    datos.id_tipo_solicitante = toNumber(leer.opcion("id_tipo_solicitante", ids(TIPOS_SOLICITANTE), { obligatorio: true }));
    const seccion = sectionFor(TIPOS_SOLICITANTE, String(datos.id_tipo_solicitante));
    if (seccion === "empresa" || seccion === "sociedad")
        {datos.organizacion = leer.texto("organizacion", REGLAS.organizacion, { obligatorio: true });}
    if (seccion === "empresa")
        {datos.tipo_empresa = leer.opcion("tipo_empresa", ids(TAMANOS_EMPRESA));}
    if (seccion === "otro")
        {datos.tipo_solicitante_otro = leer.texto("tipo_solicitante_otro", REGLAS.organizacion, { obligatorio: true });}
    if (seccion !== "institucion")
        {return;}
    // Sin clave del catálogo, la institución escrita a mano es obligatoria.
    if (leer.vacio("id_institucion"))
        {datos.institucion_otra = leer.texto("institucion_otra", REGLAS.organizacion, { obligatorio: true });}
    else {
        const clave = leer.opcion("id_institucion", ids(instituciones));
        datos.id_institucion = toNumber(clave);
        if (isUnam(instituciones.find((institucion) => institucion.clave === clave)?.nombre))
            {datos.id_dependencia = leer.opcion("id_dependencia", ids(publicos.dependencias));}
    }
    datos.id_cargo = toNumber(leer.opcion("id_cargo", ids(publicos.cargos)));
}
function validateDetails(leer, datos, publicos) {
    datos.id_tipo_solicitud = toNumber(leer.opcion("id_tipo_solicitud", ids(TIPOS_SOLICITUD), { obligatorio: true }));
    const seccion = sectionFor(TIPOS_SOLICITUD, String(datos.id_tipo_solicitud));
    if (!seccion)
        {return;}
    datos.descripcion = leer.texto("descripcion", REGLAS.descripcion, { obligatorio: true, multilinea: true });
    if (seccion === "colaboracion")
        {datos.id_tipo_colaboracion = toNumber(leer.opcion("id_tipo_colaboracion", ids(publicos.tiposColaboracion)));}
    if (seccion !== "analisis")
        {return;}
    datos.id_tipo_muestra = toNumber(leer.opcion("id_tipo_muestra", ids(publicos.tiposMuestra)));
    datos.norma_lineamiento = leer.texto("norma_lineamiento", REGLAS.norma);
    datos.id_tiempo_espera = toNumber(leer.opcion("id_tiempo_espera", ids(TIEMPOS_ESPERA)));
    if (String(datos.id_tiempo_espera) === TIEMPO_CON_DIAS)
        {datos.dias_respuesta = leer.entero("dias_respuesta", REGLAS.dias, { obligatorio: true });}
    datos.objetivos = leer.texto("objetivos", REGLAS.descripcion, { multilinea: true });
    datos.certificado_requerido = toNumber(leer.opcion("certificado_requerido", ids(CERTIFICACIONES)));
    datos.equipo_especifico = leer.texto("equipo_especifico", REGLAS.descripcion, { multilinea: true });
}
