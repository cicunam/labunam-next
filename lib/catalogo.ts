import { consultar } from "./db";
import { normalizarCatalogo } from "./normalizarCatalogo";
import type { Catalogo } from "./tipos";
import type { DatosCatalogo, FilaLaboratorio, FilaEquipo, FilaDistincion } from "./tiposBase";

export async function construirCatalogo(): Promise<Catalogo> {
  const banderas = Array.from({ length: 38 }, (_, i) => `s.dis${i + 1}`).join(", ");
  const [filas, estados, disciplinas, equipos, certificaciones, acreditaciones] = await Promise.all([
    consultar<FilaLaboratorio>(`
      SELECT s.idLab, s.labNombre, s.siglas, s.idTpLab, s.entidad AS idEstado,
             s.calleNum, s.colonia, s.muniDeleg, s.cp, s.latitud, s.longitud,
             s.webLab, s.palabrasClave, s.subDis, s.marcaAutorizaInfoWeb,
             s.objInvesApli, s.objInvesBasica, s.objDocencia, s.objServicios,
             COALESCE(s.fAprobacion, s.fActualiza, s.fAplica) AS fecha,
             d.dependencia, d.iniciales, d.idEstado AS idEstadoDepen,
             cd.dep_nombre_may_min AS dependenciaTitulo, ${banderas}
      FROM r_seccion1 AS s
      LEFT JOIN catDepen AS d ON d.idDepen = s.idDepen
      LEFT JOIN catalogo_dependencias AS cd ON cd.dep_clave = d.dep_clave
      WHERE s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)
      ORDER BY s.labNombre`),
    consultar<DatosCatalogo["estados"][number]>("SELECT idEstado, estado FROM catEstados"),
    consultar<DatosCatalogo["disciplinas"][number]>("SELECT idDis, disiplina FROM catDisiplina WHERE idDis BETWEEN 1 AND 38"),
    consultar<FilaEquipo>("SELECT idLab, nombre, tpPruebasServicio FROM r_equipoPrincipal ORDER BY idLab, idEquipoPrinci"),
    consultar<FilaDistincion>("SELECT idLab, certificacion AS nombre, organismo, fFin FROM r_certificaciones WHERE TRIM(certificacion) <> '' ORDER BY fFin DESC"),
    consultar<FilaDistincion>("SELECT idLab, acreditacion AS nombre, organismo, fFin FROM r_acreditaciones WHERE TRIM(acreditacion) <> '' ORDER BY fFin DESC"),
  ]);
  return normalizarCatalogo({ filas, estados, disciplinas, equipos, certificaciones, acreditaciones });
}

let copia: Catalogo | undefined;
let vence = 0;
let pendiente: Promise<Catalogo> | undefined;

export async function cargarCatalogo(): Promise<Catalogo> {
  if (copia && Date.now() < vence) return copia;
  if (pendiente) return pendiente;
  pendiente = construirCatalogo().then((datos) => {
    const segundos = Number(process.env.LABUNAM_CATALOGO_SEGUNDOS ?? 600);
    vence = Date.now() + (Number.isFinite(segundos) && segundos > 0 ? segundos : 600) * 1000;
    copia = datos;
    return datos;
  }).catch(() => {
    if (copia) return copia;
    throw new Error("El catálogo no está disponible en este momento.");
  }).finally(() => { pendiente = undefined; });
  return pendiente;
}
