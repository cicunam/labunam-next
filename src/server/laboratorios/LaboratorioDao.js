import { query } from "../config/dbconnection.js";

class LaboratorioDao {
  async getAllActive() {
    // El esquema heredado guarda las disciplinas en 38 columnas de banderas.
    const disciplineColumns = Array.from({ length: 38 }, (_, index) => `s.dis${index + 1}`).join(
      ", ",
    );
    return query(`
      SELECT s.idLab, s.labNombre, s.siglas, s.idTpLab, s.entidad AS idEstado,
             s.calleNum, s.colonia, s.muniDeleg, s.cp, s.latitud, s.longitud,
             s.webLab, s.palabrasClave, s.subDis, s.marcaAutorizaInfoWeb,
             s.objInvesApli, s.objInvesBasica, s.objDocencia, s.objServicios,
             COALESCE(s.fAprobacion, s.fActualiza, s.fAplica) AS fecha,
             d.dependencia, d.iniciales, d.idEstado AS idEstadoDepen,
             cd.dep_nombre_may_min AS dependenciaTitulo, ${disciplineColumns}
      FROM r_seccion1 AS s
      LEFT JOIN catDepen AS d ON d.idDepen = s.idDepen
      LEFT JOIN catalogo_dependencias AS cd ON cd.dep_clave = d.dep_clave
      WHERE s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)
      ORDER BY s.labNombre`);
  }
}

export default LaboratorioDao;
