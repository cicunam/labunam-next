import { createPool } from "mysql2/promise";

// Next recarga módulos en desarrollo; el pool debe sobrevivir a esas recargas.
const proceso = globalThis;
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
export async function query(sql) {
  try {
    const [filas] = await getConnection().query(sql);
    return filas;
  } catch {
    // Los errores del motor pueden incluir datos de conexión; no se propagan a la interfaz.
    throw new Error("No fue posible consultar la base de LabUNAM.");
  }
}
