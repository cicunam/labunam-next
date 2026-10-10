import Link from "next/link";
import styles from "./RecentLaboratories.module.css";
import { LaboratoryCard } from "../LaboratoryCard/LaboratoryCard";
import { getPhotos } from "@/lib/fotos/fotos";

export function RecentLaboratories({ recientes, fotos, total }) {
  return (
    <section
      className={`contenido ${styles.destacados}`}
      aria-labelledby="destacados-titulo"
    >
      <div className={styles["destacados-cabeza"]}>
        <h2
          id="destacados-titulo"
          className="banda-titulo"
        >
          Recién incorporados
        </h2>
        <Link
          className={styles["destacados-todos"]}
          href="/laboratorios"
        >
          Ver los {total}
        </Link>
      </div>
      <div className={styles.reticula}>
        {recientes.map((lab) => (
          <LaboratoryCard
            key={lab.idLab}
            laboratorio={lab}
            foto={getPhotos(lab.idLab, fotos, lab.grupos)[0]}
          />
        ))}
      </div>
    </section>
  );
}
