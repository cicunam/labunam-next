import type { Foto } from "@/lib/fotos";
import type { Laboratorio } from "@/lib/tipos";
import { redes } from "@/lib/presentacion";
import styles from "./Tarjeta.module.css";

export function Tarjeta({ laboratorio: lab, foto, prioritaria = false }: { laboratorio: Pick<Laboratorio, "idLab" | "nombre" | "tipo" | "entidad" | "sedeNombre"> & { servicios: number; equipos: number }; foto: Foto; prioritaria?: boolean }) {
  return (
    <article className={styles.tarjeta}>
      <div className={styles["tarjeta-foto"]}>
        <img className={styles["tarjeta-imagen"]} src={foto.src} srcSet={foto.srcSet} sizes="(min-width: 1128px) 25vw, (min-width: 992px) 33vw, (min-width: 744px) 50vw, 100vw" alt="" loading={prioritaria ? "eager" : "lazy"} fetchPriority={prioritaria ? "high" : "auto"} decoding="async" />
        <span className={styles["tarjeta-insignia"]} data-tipo={lab.tipo}>{redes[lab.tipo].singular}</span>
      </div>
      <div className={styles["tarjeta-meta"]}>
        <h3 className={styles["tarjeta-titulo"]}><button className={styles["tarjeta-disparador"]} type="button" data-ficha={lab.idLab} aria-haspopup="dialog">{lab.nombre}</button></h3>
        <p className={styles["tarjeta-linea"]}>{lab.entidad}</p>
        {lab.sedeNombre && <p className={styles["tarjeta-linea"]}>{lab.sedeNombre}</p>}
        {(lab.servicios + lab.equipos > 0) && <p className={styles["tarjeta-cifra"]}>{lab.servicios > 0 && <><strong>{lab.servicios}</strong> {lab.servicios === 1 ? "servicio" : "servicios"}</>}{lab.servicios > 0 && lab.equipos > 0 && " · "}{lab.equipos > 0 && <><strong>{lab.equipos}</strong> {lab.equipos === 1 ? "equipo" : "equipos"}</>}</p>}
      </div>
    </article>
  );
}
