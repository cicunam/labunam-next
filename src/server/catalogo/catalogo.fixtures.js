export function createLaboratorioRow(cambios = {}) {
  return {
    idLab: 1,
    labNombre: "LABORATORIO DE MICROSCOPÍA",
    siglas: "LMX",
    idTpLab: 2,
    idEstado: 0,
    idEstadoDepen: 1,
    dependencia: "CENTRO DE PRUEBAS",
    dependenciaTitulo: null,
    iniciales: "CP",
    calleNum: "CALLE DE PRUEBA 10",
    colonia: "0",
    muniDeleg: "MUNICIPIO DE PRUEBA",
    cp: "01234",
    latitud: "19.3",
    longitud: "-99.2",
    webLab: "example.org",
    palabrasClave: "Imagen",
    subDis: "Óptica",
    marcaAutorizaInfoWeb: 0,
    objServicios: 1,
    objDocencia: 0,
    objInvesBasica: 1,
    objInvesApli: 0,
    fecha: "2026-01-01",
    dis17: 1,
    ...cambios,
  };
}
export function createTestData() {
  return {
    filas: [
      createLaboratorioRow(),
      createLaboratorioRow({
        idLab: 2,
        labNombre: "ANÁLISIS DE MATERIALES",
        idTpLab: 3,
        idEstado: 2,
        dis17: 1,
        dis10: 1,
        marcaAutorizaInfoWeb: 2,
      }),
      createLaboratorioRow({ idLab: 3, labNombre: "CENTRO DE IMAGEN", idTpLab: 4, idEstado: 1 }),
    ],
    estados: [
      { idEstado: 1, estado: "DISTRITO FEDERAL" },
      { idEstado: 2, estado: "QUERETARO" },
    ],
    disciplinas: [
      { idDis: 17, disiplina: "FÍSICA" },
      { idDis: 10, disiplina: "MATERIALES" },
    ],
    equipos: [
      { idLab: 1, nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía óptica" },
      { idLab: 1, nombre: " MICROSCOPIO   OPTICO ", tpPruebasServicio: "MICROSCOPIA OPTICA" },
      { idLab: 2, nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía electrónica" },
      { idLab: 2, nombre: "Difractómetro", tpPruebasServicio: "Rayos X" },
      { idLab: 3, nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía óptica" },
    ],
    certificaciones: [
      { idLab: 1, nombre: "ISO 9001:2015", organismo: "Organismo de prueba", fFin: "2020-01-01" },
    ],
    acreditaciones: [
      { idLab: 2, nombre: "Acreditación de prueba", organismo: null, fFin: "0000-00-00" },
    ],
  };
}
