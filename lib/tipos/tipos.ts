export type TipoLaboratorio = "nacionales" | "universitarios" | "unidades" | "internacionales";
export type Perfil = "servicios" | "docencia" | "basica" | "aplicada";
export type Grupo = "biologia" | "salud" | "quimica" | "fisica" | "materiales" | "computo" | "tierra" | "ingenieria" | "sostenibilidad" | "humanidades";
export type Eje = "tipo" | "disciplina" | "especialidad" | "sede" | "perfil" | "reconocimiento";
export type Criterios = Partial<Record<Eje | "q", string>>;

export type Laboratorio = {
  idLab: number;
  nombre: string;
  siglas: string;
  tipo: TipoLaboratorio;
  entidad: string;
  entidadSiglas: string;
  sede: string;
  sedeNombre: string;
  grupos: Grupo[];
  disciplinas: string[];
  palabrasClave: string;
  servicios: string[];
  equipos: string[];
  distinciones: string[];
  certificado: boolean;
  acreditado: boolean;
  micrositio: boolean;
  perfil: Perfil[];
  ubicacion: string;
  mapa: string;
  sitio: string;
  fecha: string;
  indice: string;
};

export type Resultado = Laboratorio & { coincidencias: string[]; enNombre: boolean };
export type Opcion = { clave: string; etiqueta: string; total: number };
export type Catalogo = {
  laboratorios: Laboratorio[];
  sedes: Opcion[];
  disciplinas: Opcion[];
  sugerencias: string[];
};
