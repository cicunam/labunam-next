import LaboratorioDao from "../laboratorios/LaboratorioDao";
import EstadoDao from "../estados/EstadoDao";
import DisciplinaDao from "../disciplinas/DisciplinaDao";
import EquipoDao from "../equipos/EquipoDao";
import CertificacionDao from "../certificaciones/CertificacionDao";
import AcreditacionDao from "../acreditaciones/AcreditacionDao";
import { assembleCatalog } from "./catalogoAssembler";
import { getCachedCatalog } from "./catalogoCache";

const laboratorioDao = new LaboratorioDao();
const estadoDao = new EstadoDao();
const disciplinaDao = new DisciplinaDao();
const equipoDao = new EquipoDao();
const certificacionDao = new CertificacionDao();
const acreditacionDao = new AcreditacionDao();

export async function buildCatalog() {
  // Seis lecturas por lote: nunca una consulta adicional por cada laboratorio.
  const [filas, estados, disciplinas, equipos, certificaciones, acreditaciones] = await Promise.all(
    [
      laboratorioDao.getAllActive(),
      estadoDao.getAll(),
      disciplinaDao.getAll(),
      equipoDao.getAll(),
      certificacionDao.getAll(),
      acreditacionDao.getAll(),
    ],
  );

  return assembleCatalog({ filas, estados, disciplinas, equipos, certificaciones, acreditaciones });
}

export function loadCatalog() {
  return getCachedCatalog(buildCatalog);
}
