import { query } from "../db/db";

/** Lee las seis fuentes públicas en paralelo; devuelve filas SQL sin normalizar. */
export async function readCatalogRows() {
  const banderas = Array.from({ length: 38 }, (_, i) => `s.dis${i + 1}`).join(", ");
  const [filas, estados, disciplinas, equipos, certificaciones, acreditaciones] = await Promise.all(
    [
      query(`
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
      query("SELECT idEstado, estado FROM catEstados"),
      query("SELECT idDis, disiplina FROM catDisiplina WHERE idDis BETWEEN 1 AND 38"),
      query(
        "SELECT idLab, nombre, tpPruebasServicio FROM r_equipoPrincipal ORDER BY idLab, idEquipoPrinci",
      ),
      query(
        "SELECT idLab, certificacion AS nombre, organismo, fFin FROM r_certificaciones WHERE TRIM(certificacion) <> '' ORDER BY fFin DESC",
      ),
      query(
        "SELECT idLab, acreditacion AS nombre, organismo, fFin FROM r_acreditaciones WHERE TRIM(acreditacion) <> '' ORDER BY fFin DESC",
      ),
    ],
  );
  return { filas, estados, disciplinas, equipos, certificaciones, acreditaciones };
}
