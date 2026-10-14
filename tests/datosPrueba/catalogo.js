// LabUNAM
// Datos de prueba
// catalogo (filas falsas con la forma que devuelven LaboratorioDao y DisciplinaDao)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Las pruebas unitarias arman el catálogo con estos datos sin abrir MySQL.
// createLaboratorioRow acepta cambios puntuales para probar un caso sin repetir la fila completa.
// Como en MySQL, equipos, certificaciones y acreditaciones llegan como arreglos de
// JSON_ARRAYAGG, o null cuando el laboratorio no tiene ninguno.

export function createLaboratorioRow(changes = {}) {
  return {
    idLab: 1,
    labNombre: "LABORATORIO DE MICROSCOPÍA",
    siglas: "LMX",
    idTpLab: 2,
    estado: "DISTRITO FEDERAL",
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
    equipos: [
      { nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía óptica" },
      { nombre: " MICROSCOPIO   OPTICO ", tpPruebasServicio: "MICROSCOPIA OPTICA" },
    ],
    certificaciones: [
      { nombre: "ISO 9001:2015", organismo: "Organismo de prueba", fFin: "2020-01-01" },
    ],
    acreditaciones: null,
    ...changes,
  };
}
export function createTestData() {
  return {
    rows: [
      createLaboratorioRow(),
      createLaboratorioRow({
        idLab: 2,
        labNombre: "ANÁLISIS DE MATERIALES",
        idTpLab: 3,
        estado: "QUERETARO",
        dis17: 1,
        dis10: 1,
        marcaAutorizaInfoWeb: 2,
        equipos: [
          { nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía electrónica" },
          { nombre: "Difractómetro", tpPruebasServicio: "Rayos X" },
        ],
        certificaciones: null,
        acreditaciones: [{ nombre: "Acreditación de prueba", organismo: null, fFin: "0000-00-00" }],
      }),
      createLaboratorioRow({
        idLab: 3,
        labNombre: "CENTRO DE IMAGEN",
        idTpLab: 4,
        equipos: [{ nombre: "Microscopio óptico", tpPruebasServicio: "Microscopía óptica" }],
        certificaciones: null,
      }),
    ],
    disciplinas: [
      { idDis: 17, disiplina: "FÍSICA" },
      { idDis: 10, disiplina: "MATERIALES" },
    ],
  };
}
