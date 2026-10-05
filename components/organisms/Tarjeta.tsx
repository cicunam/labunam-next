import type { Foto } from "@/lib/fotos";
import type { Laboratorio } from "@/lib/tipos";
import { redes, cifras } from "@/lib/presentacion";
import { capacidadesDe, fragmentoCapacidad } from "@/lib/capacidades";
import { Icono } from "../atoms/Icono";
import styles from "./Tarjeta.module.css";

type DatosTarjeta = Pick<Laboratorio, "idLab" | "nombre" | "tipo" | "entidad" | "sedeNombre" | "servicios" | "equipos"> & Partial<Pick<Laboratorio, "grupos">>;
export function Tarjeta({ laboratorio: lab, foto, prioritaria = false, coincidencias = [], busqueda = "" }: { laboratorio: DatosTarjeta; foto: Foto; prioritaria?: boolean; coincidencias?: string[]; busqueda?: string }) {
  const capacidades = capacidadesDe(lab.servicios, lab.equipos, coincidencias);
  const area = lab.grupos?.length === 1 ? lab.grupos[0] : "general";
  return (
    <article className={styles.tarjeta}>
      <span className={styles.insignia} data-tipo={lab.tipo}>{redes[lab.tipo].singular}</span>
      <div className={styles.encabezado}>
        <h3 className={styles.titulo}><button className={styles.disparador} type="button" data-ficha={lab.idLab} aria-haspopup="dialog">{lab.nombre}</button></h3>
        <div className={styles.visual} data-tipo-imagen={foto.tipo}>
          {foto.tipo === "ilustracion" ? <Icono nombre={area} tamano={30} /> :
            <img src={foto.src} srcSet={foto.srcSet} sizes="64px" alt="" loading={prioritaria ? "eager" : "lazy"} fetchPriority={prioritaria ? "high" : "auto"} decoding="async" />}
        </div>
      </div>
      <div className={styles.ubicacion}>
        <p className={styles.entidad}>{lab.entidad}</p>
        {lab.sedeNombre && <p className={styles.sede}>{lab.sedeNombre}</p>}
      </div>
      {capacidades.items.length > 0 && <div className={styles.capacidades}>
        <p className={styles.etiqueta}>{capacidades.coincide ? "Coincide con tu búsqueda" : "Servicios y equipos"}</p>
        <ul>{capacidades.items.map(({ texto, tipo }) => <li key={texto}><span className={styles.tipo}>{tipo}</span><span className={styles.descripcion} title={texto}>{fragmentoCapacidad(texto, capacidades.coincide ? busqueda : "")}</span></li>)}</ul>
      </div>}
      <footer className={styles.pie}>
        <span>{cifras(lab.servicios.length, lab.equipos.length)}</span>
        <span className={styles.ver} aria-hidden="true">Ver ficha <span>↗</span></span>
      </footer>
    </article>
  );
}
