import { query } from "../config/dbconnection.js";

class AcreditacionDao {
  async getAll() {
    return query(
      "SELECT idLab, acreditacion AS nombre, organismo, fFin FROM r_acreditaciones WHERE TRIM(acreditacion) <> '' ORDER BY fFin DESC",
    );
  }
}

export default AcreditacionDao;
