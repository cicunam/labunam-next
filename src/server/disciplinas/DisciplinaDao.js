// LabUNAM
// Servidor: disciplinas
// DisciplinaDao (consulta SQL del catálogo de las 38 disciplinas)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Conexión
import { query } from "../config/dbconnection.js";

// Definición del DAO
class DisciplinaDao {
  // Devuelve id y nombre de las 38 disciplinas que corresponden a las columnas dis1…dis38.
  async getAll() {
    return query("SELECT idDis, disiplina FROM catDisiplina WHERE idDis BETWEEN 1 AND 38");
  }
}

export default DisciplinaDao;
