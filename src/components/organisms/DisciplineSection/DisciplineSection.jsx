import Link from "next/link";
import styles from "./DisciplineSection.module.css";
import { grupos } from "@/lib/grupos/grupos";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";

const DisciplineSection = ({ areaCounts }) => {
  return (
    <section
      className={`content ${styles.disciplines} ${styles["band-tint"]}`}
      aria-labelledby="disciplines-title"
    >
      <h2
        id="disciplines-title"
        className="band-title"
      >
        Buscar por disciplina
      </h2>
      <ul className={styles["disciplines-list"]}>
        {grupos.map((g) => (
          <li key={g.clave}>
            <Link
              className={styles.discipline}
              href={getCatalogUrl({ disciplina: g.clave })}
            >
              <span className={styles["discipline-name"]}>{g.etiqueta}</span>
              <span className={styles["discipline-count"]}>{areaCounts[g.clave]} laboratorios</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DisciplineSection;
