// LabUNAM
// Organismos
// DisciplineSection (áreas de la portada con su número de laboratorios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { grupos } from "@/lib/grupos/grupos";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";

// Estilos
import styles from "./DisciplineSection.module.css";

// Definición del componente
const DisciplineSection = ({
  areaCounts, // Object - Número de laboratorios por clave de área ({ biologia: 12, … })
}) => {
  // Interfaz
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
