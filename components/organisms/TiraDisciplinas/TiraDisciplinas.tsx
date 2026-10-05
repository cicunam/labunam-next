import Link from "next/link";
import { grupos } from "@/lib/grupos/grupos";
import type { Criterios } from "@/lib/tipos/tipos";
import { urlCatalogo } from "@/lib/presentacion/presentacion";
import { Icono } from "../../atoms/Icono/Icono";
import styles from "./TiraDisciplinas.module.css";

export function TiraDisciplinas({ criterios }: { criterios: Criterios }) {
  return (
    <div className={styles["tira-marco"]} data-tira>
      <button type="button" className={`${styles["tira-flecha"]} ${styles["tira-flecha-antes"]}`} data-mover="-1" aria-label="Ver disciplinas anteriores" hidden>‹</button>
      <nav className={styles["tira-pista"]} aria-label="Disciplina" data-pista>
        {[{ clave: "", etiqueta: "Todas" }, ...grupos].map((grupo) => <Link key={grupo.clave} href={urlCatalogo(criterios, { disciplina: grupo.clave })} className={styles["tira-categoria"]} aria-current={(criterios.disciplina ?? "") === grupo.clave ? "page" : undefined}>
          <Icono nombre={grupo.clave as typeof grupos[number]["clave"] || "todas"} /><span>{grupo.etiqueta}</span>
        </Link>)}
      </nav>
      <button type="button" className={`${styles["tira-flecha"]} ${styles["tira-flecha-despues"]}`} data-mover="1" aria-label="Ver más disciplinas" hidden>›</button>
    </div>
  );
}
