// LabUNAM
// Organismos
// LaboratoryNetworks (tarjetas de las redes de laboratorios en la portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";

// Estilos
import styles from "./LaboratoryNetworks.module.css";

// Constantes
// Cada tarjeta conserva juntos sus datos; añadir una red no depende de alinear índices.
// El nombre de cada red sale de redes en presentacion.js.
const networks = [
  {
    tipo: "nacionales",
    image: "laboratorio-abc.jpeg",
    description:
      "Investigación especializada con tecnología de vanguardia, compartida entre instituciones para formar especialistas y atender necesidades de la sociedad.",
  },
  {
    tipo: "universitarios",
    image: "mision.png",
    description:
      "Investigación y servicios con tecnología de vanguardia que promueven la colaboración y el uso compartido de recursos entre entidades académicas.",
  },
  {
    tipo: "unidades",
    image: "vision.png",
    description:
      "Servicios con equipo especializado dentro y fuera de la UNAM, que fortalecen la vinculación con el sector productivo.",
  },
];

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
        {networks.map(({ tipo, image, description }) => (
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
