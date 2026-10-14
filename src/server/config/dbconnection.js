// LabUNAM
// Servidor: config
// dbconnection (pool único de MySQL y consultas de sólo lectura)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { createPool } from "mysql2/promise";

// Constantes
// Next recarga módulos en desarrollo; el pool debe sobrevivir a esas recargas.
const proceso = globalThis;

// Utilidades
// Devuelve el pool guardado en el proceso o lo crea con las variables de entorno.
function getConnection() {
  if (proceso.poolLabunam) {
    return proceso.poolLabunam;
  }
  const {
    LABUNAM_DB_HOST: host,
    LABUNAM_DB_NAME: database,
    LABUNAM_DB_USER: user,
    LABUNAM_DB_PASS: password,
  } = process.env;
  if (!host || !database || !user) {
    throw new Error("Falta configurar la conexión de LabUNAM.");
  }
  proceso.poolLabunam = createPool({
    host,
    database,
    user,
    password,
    charset: "utf8mb4",
    dateStrings: true,
    decimalNumbers: true,
    connectionLimit: 6,
    connectTimeout: 5000,
  });
  return proceso.poolLabunam;
}

// Definición del módulo
// Ejecuta una consulta y devuelve sus filas; los valores dinámicos van separados del SQL.
export async function query(
  sql, // String - Consulta SQL con marcadores ? en lugar de valores dinámicos
  parameters = [], // Array Optional - Valores que mysql2 sustituye en los marcadores de la consulta
) {
  try {
    const [filas] = await getConnection().query(sql, parameters);
    return filas;
  } catch {
    // Los errores del motor pueden incluir datos de conexión; no se propagan a la interfaz.
    throw new Error("No fue posible consultar la base de LabUNAM.");
  }
}
