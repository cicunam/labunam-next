import Link from "next/link";
import styles from "./DisciplineSection.module.css";
import { grupos } from "@/lib/grupos/grupos";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";

export function DisciplineSection({ areas }) {
  return (
    <section
      className={`contenido ${styles.disciplinas} ${styles["banda-tinte"]}`}
      aria-labelledby="disciplinas-titulo"
    >
      <h2
        id="disciplinas-titulo"
        className="banda-titulo"
      >
        Buscar por disciplina
      </h2>
      <ul className={styles["disciplinas-lista"]}>
        {grupos.map((g) => (
          <li key={g.clave}>
            <Link
              className={styles.disciplina}
              href={getCatalogUrl({ disciplina: g.clave })}
            >
              <span className={styles["disciplina-nombre"]}>{g.etiqueta}</span>
              <span className={styles["disciplina-cuenta"]}>{areas[g.clave]} laboratorios</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
