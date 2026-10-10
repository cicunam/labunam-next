import { query } from "../config/dbconnection.js";

class EstadoDao {
  async getAll() {
    return query("SELECT idEstado, estado FROM catEstados");
  }
}

export default EstadoDao;
