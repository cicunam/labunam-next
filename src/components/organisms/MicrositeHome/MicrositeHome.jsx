// LabUNAM
// Organismos
// MicrositeHome (portada del micrositio: presentación, misión y visión)
// Ivonne Aviles <daviles@cic.unam.mx>

// Dependencias
import Link from "next/link";

// Estilos
import styles from "./MicrositeHome.module.css";

// Constantes
const empty = "Sin información registrada todavía.";

// Definición del componente
const ItemList = ({
  items, // Array - Textos de una lista; vacío muestra el mensaje provisional
}) => {
  if (!items.length) {
    return <p className={styles.empty}>{empty}</p>;
  }
  return (
    <ul>
      {items.map((text, index) => (
        <li key={index}>{text}</li>
      ))}
    </ul>
  );
};

const MicrositeHome = ({
  idLab, // String - Identificador tomado de la URL
  paragraphs = [], // Array Optional - Párrafos de la presentación
  mission = [], // Array Optional - Frases de la misión
  vision = [], // Array Optional - Frases de la visión
  labels = [], // Array Optional - Áreas del laboratorio
}) => {
  // Preparación de datos
  const contact = `/contacto?laboratorio=${idLab}`;

  // Interfaz
  return (
    <div className={styles.home}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Micrositio · Laboratorio UNAM</p>
        <h2 id="micrositio-presentacion">Investigación y servicios especializados</h2>
        <p className={styles.lead}>
          Conoce las capacidades, la infraestructura y los servicios de nuestro laboratorio.
        </p>
        <Link className={styles.cta} href={contact} prefetch={false}>
          Contactar al laboratorio →
        </Link>
      </header>
      <section className={styles.about} aria-labelledby="micrositio-conoce">
        <h2 id="micrositio-conoce">Conoce nuestro laboratorio</h2>
        {paragraphs.length ? (
          paragraphs.map((text, index) => <p key={index}>{text}</p>)
        ) : (
          <p className={styles.empty}>{empty}</p>
        )}
        {labels.length ? <p className={styles.tags}>{labels.join(" · ")}</p> : null}
      </section>
      <section className={styles.pair} aria-labelledby="micrositio-mision">
        <h2 id="micrositio-mision">Misión y visión</h2>
        <div className={styles.columns}>
          <div>
            <h3>Misión</h3>
            <ItemList items={mission} />
          </div>
          <div>
            <h3>Visión</h3>
            <ItemList items={vision} />
          </div>
        </div>
      </section>
      <section className={styles.close}>
        <h2>¿Buscas un servicio o una colaboración?</h2>
        <p>Comparte el objetivo de tu proyecto con el equipo del laboratorio.</p>
        <Link className={styles.cta} href={contact} prefetch={false}>
          Contactar al laboratorio →
        </Link>
      </section>
    </div>
  );
};

export default MicrositeHome;