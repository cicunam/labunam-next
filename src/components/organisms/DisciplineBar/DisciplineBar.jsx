import Link from "next/link";
import { grupos } from "@/lib/grupos/grupos";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";
import Icon from "../../atoms/Icon/Icon";
import styles from "./DisciplineBar.module.css";

const DisciplineBar = ({ criterios }) => {
  return (
    <div
      className={styles["tira-marco"]}
      data-tira
    >
      <button
        type="button"
        className={`${styles["tira-flecha"]} ${styles["tira-flecha-antes"]}`}
        data-mover="-1"
        aria-label="Ver disciplinas anteriores"
        hidden
      >
        ‹
      </button>
      <nav
        className={styles["tira-pista"]}
        aria-label="Disciplina"
        data-pista
      >
        {[{ clave: "", etiqueta: "Todas" }, ...grupos].map((grupo) => (
          <Link
            key={grupo.clave}
            href={getCatalogUrl(criterios, { disciplina: grupo.clave })}
            className={styles["tira-categoria"]}
            aria-current={(criterios.disciplina ?? "") === grupo.clave ? "page" : undefined}
          >
            <Icon nombre={grupo.clave || "todas"} />
            <span>{grupo.etiqueta}</span>
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className={`${styles["tira-flecha"]} ${styles["tira-flecha-despues"]}`}
        data-mover="1"
        aria-label="Ver más disciplinas"
        hidden
      >
        ›
      </button>
    </div>
  );
};

export default DisciplineBar;
