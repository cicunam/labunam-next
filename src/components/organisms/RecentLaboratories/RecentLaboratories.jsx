import Link from "next/link";
import styles from "./RecentLaboratories.module.css";
import LaboratoryCard from "../LaboratoryCard/LaboratoryCard";
import { getPhotos } from "@/lib/fotos/fotos";

const RecentLaboratories = ({ recentLaboratorios, photos, total }) => {
  return (
    <section
      className={`content ${styles.featured}`}
      aria-labelledby="featured-title"
    >
      <div className={styles["featured-header"]}>
        <h2
          id="featured-title"
          className="band-title"
        >
          Recién incorporados
        </h2>
        <Link
          className={styles["featured-all"]}
          href="/laboratorios"
        >
          Ver los {total}
        </Link>
      </div>
      <div className={styles.grid}>
        {recentLaboratorios.map((lab) => (
          <LaboratoryCard
            key={lab.idLab}
            laboratorio={lab}
            photo={getPhotos(lab.idLab, photos, lab.grupos)[0]}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentLaboratories;
