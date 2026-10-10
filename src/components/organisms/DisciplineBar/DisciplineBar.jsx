import Link from "next/link";
import { grupos } from "@/lib/grupos/grupos";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";
import Icon from "../../atoms/Icon/Icon";
import styles from "./DisciplineBar.module.css";

const DisciplineBar = ({ criteria }) => {
  return (
    <div
      className={styles["strip-frame"]}
      data-strip
    >
      <button
        type="button"
        className={`${styles["strip-arrow"]} ${styles["strip-arrow-before"]}`}
        data-move="-1"
        aria-label="Ver disciplinas anteriores"
        hidden
      >
        ‹
      </button>
      <nav
        className={styles["strip-track"]}
        aria-label="Disciplina"
        data-track
      >
        {[{ clave: "", etiqueta: "Todas" }, ...grupos].map((grupo) => (
          <Link
            key={grupo.clave}
            href={getCatalogUrl(criteria, { disciplina: grupo.clave })}
            className={styles["strip-category"]}
            aria-current={(criteria.disciplina ?? "") === grupo.clave ? "page" : undefined}
          >
            <Icon name={grupo.clave || "all"} />
            <span>{grupo.etiqueta}</span>
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className={`${styles["strip-arrow"]} ${styles["strip-arrow-after"]}`}
        data-move="1"
        aria-label="Ver más disciplinas"
        hidden
      >
        ›
      </button>
    </div>
  );
};

export default DisciplineBar;
