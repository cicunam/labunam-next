// LabUNAM
// Servidor: fotos
// fotosService (lectura de los manifiestos de imágenes aprobadas)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Definición del servicio
// Une los dos manifiestos por laboratorio; los originales tienen prioridad sobre las aprobadas web.
// Si falta un manifiesto o no se puede leer, se usa un objeto vacío.
export async function readPhotos() {
  try {
    const base = JSON.parse(
      await readFile(join(process.cwd(), "public/fotos/manifiesto.json"), "utf8").catch(() => "{}"),
    );
    const web = JSON.parse(
      await readFile(join(process.cwd(), "public/fotos/manifiesto-web.json"), "utf8").catch(
        () => "{}",
      ),
    );
    const manifiesto = { ...web, ...base };
    return manifiesto;
  } catch {
    return {};
  }
}
