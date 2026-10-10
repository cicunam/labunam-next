import { query } from "../config/dbconnection.js";

class CertificacionDao {
  async getAll() {
    return query(
      "SELECT idLab, certificacion AS nombre, organismo, fFin FROM r_certificaciones WHERE TRIM(certificacion) <> '' ORDER BY fFin DESC",
    );
  }
}

export default CertificacionDao;
