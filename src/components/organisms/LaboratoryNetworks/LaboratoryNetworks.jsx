import Link from "next/link";
import styles from "./LaboratoryNetworks.module.css";
import { homeNetworks } from "@/lib/home/homeContent";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";

export function LaboratoryNetworks({ totales }) {
  return (
    <section
      className={`contenido ${styles.redes}`}
      aria-labelledby="redes-titulo"
    >
      <h2
        id="redes-titulo"
        className="banda-titulo"
      >
        Tres redes, una universidad
      </h2>
      <p className="banda-entrada">Explora la infraestructura de investigación de la UNAM.</p>
      <ul className={styles["redes-lista"]}>
        {homeNetworks.map(({ tipo, imagen, descripcion }) => (
          <li key={tipo}>
            <Link
              className={styles.red}
              href={getCatalogUrl({ tipo })}
              data-tipo={tipo}
            >
              <span
                className={styles["red-foto"]}
                style={{ "--foto": `url(/assets/images/${imagen})` }}
              />
              <span className={styles["red-cuerpo"]}>
                <span className={styles["red-titulo"]}>{redes[tipo].nombre}</span>
                <span className={styles["red-cuenta"]}>{totales[tipo]} laboratorios</span>
                <span className={styles["red-texto"]}>{descripcion}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
