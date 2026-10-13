// Filas ficticias con la forma que devuelven las consultas de los catálogos.
export function createRequestCatalogRows() {
    return {
        paises: [{ clave: "ESP", nombre: "ESPAÑA" }, { clave: "MEX", nombre: "MEXICO" }, { clave: "XXX", nombre: "  " }],
        estados: [{ clave: 9, pais_clave: "MEX", nombre: "CIUDAD DE MEXICO" }, { clave: 70, pais_clave: "USA", nombre: "TEXAS" }],
        instituciones: [{ clave: 1, nombre: "UNIVERSIDAD DE DEMOSTRACION", siglas: "UDD " }, { clave: 2, nombre: "INSTITUTO DE EJEMPLO", siglas: null }],
        dependencias: [{ clave: "010", nombre: "Instituto de Demostración" }, { clave: "011", nombre: "CCH PLANTEL DE EJEMPLO" }],
        cargos: [{ clave: 1, nombre: "Estudiante" }],
        tiposMuestra: [{ clave: 1, nombre: "Biológica" }],
        tiposColaboracion: [{ clave: 1, nombre: "Estancia" }],
    };
}
