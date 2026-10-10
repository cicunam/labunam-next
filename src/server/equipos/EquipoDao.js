import { query } from "../config/dbconnection.js";

class EquipoDao {
  async getAll() {
    return query(
      "SELECT idLab, nombre, tpPruebasServicio FROM r_equipoPrincipal ORDER BY idLab, idEquipoPrinci",
    );
  }
}

export default EquipoDao;
