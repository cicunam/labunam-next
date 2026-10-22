// LabUNAM
// Datos de prueba
// solicitudes (catálogos y filas ficticias del formulario de solicitud)
// Ángelo M

// Catálogos con la forma pública que devuelve loadRequestCatalogs.
export const catalogosEjemplo = {
  paises: [
    { clave: "ARG", nombre: "Argentina" },
    { clave: "CAN", nombre: "Canadá" },
    { clave: "ESP", nombre: "España" },
    { clave: "USA", nombre: "Estados Unidos" },
    { clave: "MEX", nombre: "México" },
  ],
  estados: {
    MEX: [
      { clave: "1", nombre: "Ciudad de México" },
      { clave: "2", nombre: "Jalisco" },
      { clave: "3", nombre: "Yucatán" },
    ],
    USA: [
      { clave: "51", nombre: "California" },
      { clave: "52", nombre: "Texas" },
    ],
  },
  dependencias: [
    { clave: "10", nombre: "Instituto de demostración" },
    { clave: "11", nombre: "Facultad de ejemplo" },
  ],
  cargos: [
    { clave: "1", nombre: "Estudiante" },
    { clave: "2", nombre: "Investigador o investigadora" },
    { clave: "3", nombre: "Técnico académico" },
  ],
  tiposMuestra: [
    { clave: "1", nombre: "Biológica" },
    { clave: "2", nombre: "Mineral" },
    { clave: "3", nombre: "Química" },
  ],
  tiposColaboracion: [
    { clave: "1", nombre: "Proyecto de investigación" },
    { clave: "2", nombre: "Estancia" },
  ],
};

// Instituciones con la forma que devuelve la búsqueda de instituciones.
export const institucionesEjemplo = [
  { clave: "1", nombre: "Universidad Nacional Autonoma de Mexico", siglas: "UNAM" },
  { clave: "2", nombre: "Universidad de Demostracion", siglas: "UDD" },
  { clave: "3", nombre: "Instituto Tecnologico de Ejemplo", siglas: "ITE" },
  { clave: "4", nombre: "Centro de Ejemplo de la Universidad de Demostracion", siglas: "" },
];

// Filas con la forma que devuelve CatalogoSolicitudDao.
export function createRequestCatalogRows() {
  return {
    paises: [
      { clave: "ESP", nombre: "ESPAÑA" },
      { clave: "MEX", nombre: "MEXICO" },
      { clave: "XXX", nombre: "  " },
    ],
    estados: [
      { clave: 9, pais_clave: "MEX", nombre: "CIUDAD DE MEXICO" },
      { clave: 70, pais_clave: "USA", nombre: "TEXAS" },
    ],
    instituciones: [
      { clave: 1, nombre: "UNIVERSIDAD DE DEMOSTRACION", siglas: "UDD " },
      { clave: 2, nombre: "INSTITUTO DE EJEMPLO", siglas: null },
    ],
    dependencias: [
      { clave: "010", nombre: "Instituto de Demostración" },
      { clave: "011", nombre: "CCH PLANTEL DE EJEMPLO" },
    ],
    cargos: [{ clave: 1, nombre: "Estudiante" }],
    tiposMuestra: [{ clave: 1, nombre: "Biológica" }],
    tiposColaboracion: [{ clave: 1, nombre: "Estancia" }],
  };
}

// Laboratorios con la forma que devuelve la ruta de sugerencias; dos comparten nombre.
export const laboratoriosEjemplo = [
  { idLab: 18, nombre: "Laboratorio de Microscopía", entidad: "Instituto de Demostración" },
  { idLab: 25, nombre: "Laboratorio de Difracción", entidad: "Instituto de Demostración" },
  { idLab: 26, nombre: "Laboratorio de Difracción", entidad: "Facultad de Ejemplo" },
];
