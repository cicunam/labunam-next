import { query } from "../db/db";
import { toTitleCase } from "../texto/texto";
// Siglas de planteles de la UNAM presentes en el catálogo de dependencias.
const SIGLAS_DEPENDENCIAS = ["CCH", "ENP", "FES"];
// Los catálogos guardan muchos nombres en mayúsculas; se presentan con mayúsculas iniciales.
function toOptions(filas, siglasConservadas = []) {
    return filas
        .map(({ clave, nombre, siglas }) => ({ clave: String(clave), nombre: toTitleCase(String(nombre ?? ""), siglasConservadas), ...(siglas !== undefined && { siglas: String(siglas ?? "").trim() }) }))
        .filter((opcion) => opcion.nombre);
}
export async function buildRequestCatalogs() {
    const [paises, estados, instituciones, dependencias, cargos, tiposMuestra, tiposColaboracion] = await Promise.all([
        query("SELECT pais_clave AS clave, pais_nombre AS nombre FROM catalogo_paises ORDER BY pais_nombre"),
        query("SELECT id AS clave, pais_clave, edo_nombre AS nombre FROM catalogo_paises_edo WHERE pais_clave IN ('MEX', 'USA') ORDER BY edo_nombre"),
        // Se excluyen las instituciones con un año de término ya cumplido.
        query("SELECT institucion_clave AS clave, institucion_nombre AS nombre, institucion_siglas AS siglas FROM catalogo_instituciones WHERE anio_ActivoTermino IS NULL OR anio_ActivoTermino >= YEAR(CURDATE())"),
        query("SELECT dep_clave AS clave, COALESCE(NULLIF(TRIM(dep_nombre_may_min), ''), dep_nombre) AS nombre FROM catalogo_dependencias WHERE dep_status = 1 AND dep_fecha_cancela IS NULL ORDER BY nombre"),
        query("SELECT id AS clave, cargo AS nombre FROM cat_cargos ORDER BY cargo"),
        query("SELECT id AS clave, muestra AS nombre FROM cat_tipo_muestra ORDER BY muestra"),
        query("SELECT id AS clave, colaboracion AS nombre FROM cat_tipo_colaboracion ORDER BY colaboracion"),
    ]);
    return {
        // Las instituciones se quedan en el servidor: son miles y se buscan por texto desde su ruta API.
        instituciones: toOptions(instituciones),
        publicos: {
            paises: toOptions(paises),
            estados: { MEX: toOptions(estados.filter((fila) => fila.pais_clave === "MEX")), USA: toOptions(estados.filter((fila) => fila.pais_clave === "USA")) },
            dependencias: toOptions(dependencias, SIGLAS_DEPENDENCIAS),
            cargos: toOptions(cargos),
            tiposMuestra: toOptions(tiposMuestra),
            tiposColaboracion: toOptions(tiposColaboracion),
        },
    };
}
// Misma política que el catálogo de laboratorios: copia por proceso, carga concurrente compartida
// y respaldo de la última copia válida si la base falla.
let copia;
let vence = 0;
let pendiente;
export async function loadRequestCatalogs() {
    if (copia && Date.now() < vence)
        return copia;
    if (pendiente)
        return pendiente;
    pendiente = buildRequestCatalogs().then((datos) => {
        const segundos = Number(process.env.LABUNAM_CATALOGO_SEGUNDOS ?? 600);
        vence = Date.now() + (Number.isFinite(segundos) && segundos > 0 ? segundos : 600) * 1000;
        copia = datos;
        return datos;
    }).catch(() => {
        if (copia)
            return copia;
        throw new Error("Los catálogos de la solicitud no están disponibles en este momento.");
    }).finally(() => { pendiente = undefined; });
    return pendiente;
}
