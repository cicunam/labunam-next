// LabUNAM
// Organismos
// RecentLaboratories (laboratorios actualizados recientemente en la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { getPhotos } from "@/lib/fotos/fotos";

// Componentes
import LaboratoryCard from "../LaboratoryCard/LaboratoryCard";

// Estilos
import styles from "./RecentLaboratories.module.css";

// Definición del componente
const RecentLaboratories = ({
  recentLaboratorios, // Array - Laboratorios más recientes, con la forma del catálogo
  photos, // Object - Manifiesto de fotos por idLab que getPhotos usa para elegir cada imagen
  total, // Number - Total de laboratorios del catálogo
}) => {
  // Interfaz
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
