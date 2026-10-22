// LabUNAM
// Servidor: solicitudes
// CatalogoSolicitudDao (consultas SQL de los catálogos del formulario de solicitud)
// Ángelo M

// Conexión
import { query } from "../config/dbconnection.js";

// Definición del DAO
// Cada método devuelve filas con clave y nombre; sólo el formulario de solicitud las usa.
class CatalogoSolicitudDao {
  async getPaises() {
    return query(
      "SELECT pais_clave AS clave, pais_nombre AS nombre FROM catalogo_paises ORDER BY pais_nombre",
    );
  }

  // Sólo México y Estados Unidos tienen estados en el formulario heredado.
  async getEstados() {
    return query(
      "SELECT id AS clave, pais_clave, edo_nombre AS nombre FROM catalogo_paises_edo WHERE pais_clave IN ('MEX', 'USA') ORDER BY edo_nombre",
    );
  }

  // Se excluyen las instituciones con un año de término ya cumplido.
  async getInstituciones() {
    return query(
      "SELECT institucion_clave AS clave, institucion_nombre AS nombre, institucion_siglas AS siglas FROM catalogo_instituciones WHERE anio_ActivoTermino IS NULL OR anio_ActivoTermino >= YEAR(CURDATE())",
    );
  }

  async getDependencias() {
    return query(
      "SELECT dep_clave AS clave, COALESCE(NULLIF(TRIM(dep_nombre_may_min), ''), dep_nombre) AS nombre FROM catalogo_dependencias WHERE dep_status = 1 AND dep_fecha_cancela IS NULL ORDER BY nombre",
    );
  }

  async getCargos() {
    return query("SELECT id AS clave, cargo AS nombre FROM cat_cargos ORDER BY cargo");
  }

  async getTiposMuestra() {
    return query("SELECT id AS clave, muestra AS nombre FROM cat_tipo_muestra ORDER BY muestra");
  }

  async getTiposColaboracion() {
    return query(
      "SELECT id AS clave, colaboracion AS nombre FROM cat_tipo_colaboracion ORDER BY colaboracion",
    );
  }
}

export default CatalogoSolicitudDao;
