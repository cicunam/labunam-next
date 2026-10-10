import { query } from "../config/dbconnection.js";

class DisciplinaDao {
  async getAll() {
    return query("SELECT idDis, disiplina FROM catDisiplina WHERE idDis BETWEEN 1 AND 38");
  }
}

export default DisciplinaDao;
