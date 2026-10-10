// LabUNAM
// Organismos
// LaboratoryNetworks (tarjetas de las redes de laboratorios en la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { homeNetworks } from "@/lib/home/homeContent";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";

// Estilos
import styles from "./LaboratoryNetworks.module.css";

// Definición del componente
const LaboratoryNetworks = ({
  counts, // Object - Número de laboratorios por tipo de red ({ nacionales: 40, … })
}) => {
  // Interfaz
  return (
    <section
      className={`content ${styles.networks}`}
      aria-labelledby="networks-title"
    >
      <h2
        id="networks-title"
        className="band-title"
      >
        Tres redes, una universidad
      </h2>
      <p className="band-entry">Explora la infraestructura de investigación de la UNAM.</p>
      <ul className={styles["networks-list"]}>
        {homeNetworks.map(({ tipo, image, description }) => (
          <li key={tipo}>
            <Link
              className={styles.network}
              href={getCatalogUrl({ tipo })}
              data-type={tipo}
            >
              <span
                className={styles["network-photo"]}
                style={{ "--photo": `url(/assets/images/${image})` }}
              />

              <span className={styles["network-body"]}>
                <span className={styles["network-title"]}>{redes[tipo].nombre}</span>
                <span className={styles["network-count"]}>{counts[tipo]} laboratorios</span>
                <span className={styles["network-text"]}>{description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LaboratoryNetworks;
