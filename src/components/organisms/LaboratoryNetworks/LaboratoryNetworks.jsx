import Link from "next/link";
import styles from "./LaboratoryNetworks.module.css";
import { homeNetworks } from "@/lib/home/homeContent";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";

const LaboratoryNetworks = ({ counts }) => {
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
