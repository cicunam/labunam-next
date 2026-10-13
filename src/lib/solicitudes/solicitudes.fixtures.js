// Catálogos de ejemplo para desarrollar el formulario antes de conectar las tablas reales.
export const catalogosEjemplo = {
    paises: [
        { clave: "ARG", nombre: "Argentina" }, { clave: "CAN", nombre: "Canadá" }, { clave: "ESP", nombre: "España" },
        { clave: "USA", nombre: "Estados Unidos" }, { clave: "MEX", nombre: "México" },
    ],
    estados: {
        MEX: [{ clave: "1", nombre: "Ciudad de México" }, { clave: "2", nombre: "Jalisco" }, { clave: "3", nombre: "Yucatán" }],
        USA: [{ clave: "51", nombre: "California" }, { clave: "52", nombre: "Texas" }],
    },
    instituciones: [
        { clave: "1", nombre: "Universidad Nacional Autónoma de México" },
        { clave: "2", nombre: "Universidad de demostración" },
        { clave: "3", nombre: "Instituto tecnológico de ejemplo" },
    ],
    dependencias: [
        { clave: "10", nombre: "Instituto de demostración" }, { clave: "11", nombre: "Facultad de ejemplo" },
    ],
    cargos: [{ clave: "1", nombre: "Estudiante" }, { clave: "2", nombre: "Investigador o investigadora" }, { clave: "3", nombre: "Técnico académico" }],
    tiposMuestra: [{ clave: "1", nombre: "Biológica" }, { clave: "2", nombre: "Mineral" }, { clave: "3", nombre: "Química" }],
    tiposColaboracion: [{ clave: "1", nombre: "Proyecto de investigación" }, { clave: "2", nombre: "Estancia" }],
};
