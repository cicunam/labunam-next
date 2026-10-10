import { toTitleCase } from "../../lib/texto/texto";
import { getText } from "../laboratorios/laboratorioFormatting";

function groupByLaboratorio(filas) {
  const grupos = new Map();
  for (const fila of filas) {
    const id = Number(fila.idLab);
    const lista = grupos.get(id) ?? [];
    lista.push(fila);
    grupos.set(id, lista);
  }
  return grupos;
}
// Indexamos las relaciones una vez, en vez de recorrer todas las filas por laboratorio.
export function indexRelations(datos) {
  const estados = new Map(
    datos.estados.map((fila) => [Number(fila.idEstado), getText(fila.estado)]),
  );
  const disciplinas = new Map(
    datos.disciplinas.map((fila) => [Number(fila.idDis), toTitleCase(fila.disiplina)]),
  );
  const equiposPorLab = groupByLaboratorio(datos.equipos);
  const certificaciones = groupByLaboratorio(
    datos.certificaciones.filter((fila) => getText(fila.nombre)),
  );
  const acreditaciones = groupByLaboratorio(
    datos.acreditaciones.filter((fila) => getText(fila.nombre)),
  );
  return { estados, disciplinas, equiposPorLab, certificaciones, acreditaciones };
}
