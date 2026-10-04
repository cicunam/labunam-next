import Link from "next/link";
import { useState } from "react";
import type { DatosFicha } from "@/lib/ficha";
import { cifras, redes } from "@/lib/presentacion";
import { Galeria } from "../molecules/Galeria";
import { Pestana } from "../molecules/Pestana";
import { Insignia } from "../atoms/Insignia";
import styles from "./DetalleFicha.module.css";

const pestanas = ["Servicios", "Equipamiento", "Distinciones", "Ubicación"];
export function DetalleFicha({ laboratorio: lab, pagina = false }: { laboratorio: DatosFicha; pagina?: boolean }) {
  const [activa, setActiva] = useState(0);
  const Titulo = pagina ? "h1" : "h2";
  const contenido = [lab.servicios, lab.equipos, lab.distinciones, [lab.sedeNombre, lab.ubicacion].filter(Boolean)];
  return <>
        <div className={styles["ficha-cuerpo"]}>
          <Galeria imagenes={lab.galeria} />
          <div className={styles["ficha-encabezado"]}>
            <Insignia tono={redes[lab.tipo].tono}>{redes[lab.tipo].singular}</Insignia>
            <Titulo id="ficha-titulo" className={styles["ficha-titulo"]}>{lab.nombre}</Titulo>
            <p className={styles["ficha-entidad"]}>{lab.entidad}</p><p className={styles["ficha-sede"]}>{lab.sedeNombre}</p>
          </div>
          <div className={styles["ficha-pestanas"]} role="tablist" aria-label="Información del laboratorio">
            {pestanas.map((nombre, i) => <Pestana key={nombre} id={`ficha-pestana-${i}`} panelId={`ficha-panel-${i}`} seleccionada={activa === i} onClick={() => setActiva(i)} onKeyDown={(event) => {
              let siguiente = i;
              if (event.key === "ArrowRight") siguiente = (i + 1) % 4;
              else if (event.key === "ArrowLeft") siguiente = (i + 3) % 4;
              else if (event.key === "Home") siguiente = 0;
              else if (event.key === "End") siguiente = 3;
              else return;
              event.preventDefault(); setActiva(siguiente);
              document.querySelector<HTMLButtonElement>(`#ficha-pestana-${siguiente}`)?.focus();
            }}>{nombre}</Pestana>)}
          </div>
          {contenido.map((lista, i) => <div key={i} className={styles["ficha-panel"]} id={`ficha-panel-${i}`} role="tabpanel" aria-labelledby={`ficha-pestana-${i}`} tabIndex={0} hidden={activa !== i}>
            {lista.length ? <ul className={styles["ficha-lista"]}>{lista.map((texto, n) => <li key={n}>{texto}</li>)}</ul> : <p className={styles["ficha-vacio"]}>Sin información registrada todavía.</p>}
            {i === 3 && lab.mapa && <a className={styles["ficha-mapa"]} href={lab.mapa} target="_blank" rel="noopener">Ver en el mapa</a>}
          </div>)}
        </div>
        {(!pagina || lab.servicios.length > 0 || lab.equipos.length > 0 || lab.sitio) && <footer className={styles["ficha-pie"]}>
          <p className={styles["ficha-pie-nota"]}>{cifras(lab.servicios.length, lab.equipos.length)}</p>
          {!pagina && <Link className={styles["ficha-mapa"]} href={`/laboratorios/${lab.idLab}`} prefetch={false}>Abrir página de la ficha</Link>}
          {lab.sitio && <a className={styles["ficha-sitio"]} href={lab.sitio} target="_blank" rel="noopener">Sitio web ↗</a>}
        </footer>}
  </>;
}
