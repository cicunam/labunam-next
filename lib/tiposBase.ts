type Dato = string | number | null;
export type FilaLaboratorio = {
  idLab: number; labNombre: string; siglas: string | null; idTpLab: number;
  idEstado: Dato; idEstadoDepen: Dato; dependencia: string | null;
  dependenciaTitulo: string | null; iniciales: string | null;
  calleNum: string | null; colonia: string | null; muniDeleg: string | null;
  cp: Dato; latitud: Dato; longitud: Dato; webLab: string | null;
  palabrasClave: string | null; subDis: string | null; marcaAutorizaInfoWeb: Dato;
  objServicios: Dato; objDocencia: Dato; objInvesBasica: Dato; objInvesApli: Dato;
  fecha: string | null;
} & Partial<Record<`dis${number}`, Dato>>;
export type FilaEquipo = { idLab: number; nombre: string | null; tpPruebasServicio: string | null };
export type FilaDistincion = { idLab: number; nombre: string; organismo: string | null; fFin: string | null };
export type DatosCatalogo = {
  filas: FilaLaboratorio[];
  estados: { idEstado: number; estado: string }[];
  disciplinas: { idDis: number; disiplina: string }[];
  equipos: FilaEquipo[];
  certificaciones: FilaDistincion[];
  acreditaciones: FilaDistincion[];
};
