import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-brand"]}>
          <Link
            href="/"
            className={styles["footer-logo"]}
          >
            <img
              src="/assets/logos/labunam.webp"
              width={170}
              height={50}
              alt="LabUNAM"
            />
          </Link>
          <p className={styles["footer-tagline"]}>
            Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de
            la UNAM.
          </p>
          <a
            href="https://www.unam.mx/"
            className={styles["footer-logo"] + " " + styles["footer-logo-unam"]}
            target="_blank"
            rel="noopener"
          >
            <img
              src="/assets/logos/unam.webp"
              width={320}
              height={85}
              alt="Universidad Nacional Autónoma de México"
            />
          </a>
        </div>

        <section
          className={styles["footer-column"]}
          aria-labelledby="footer-contact"
        >
          <h2
            id="footer-contact"
            className={styles["footer-title"]}
          >
            Contacto
          </h2>
          <address className={styles["footer-address"]}>
            Circuito de la Investigación Científica S/N
            <br />
            Ciudad Universitaria, Alcaldía Coyoacán
            <br />
            Ciudad de México, C.P. 04510
          </address>
          <a
            href="https://www.cic.unam.mx/"
            className={styles["footer-link"]}
            target="_blank"
            rel="noopener"
          >
            Coordinación de la Investigación Científica
          </a>
        </section>

        <nav
          className={styles["footer-column"]}
          aria-labelledby="footer-links"
        >
          <h2
            id="footer-links"
            className={styles["footer-title"]}
          >
            Vínculos rápidos
          </h2>
          <ul className={styles["footer-list"]}>
            <li>
              <Link
                href="/laboratorios?tipo=nacionales"
                className={styles["footer-link"]}
              >
                Laboratorios nacionales
              </Link>
            </li>
            <li>
              <Link
                href="/laboratorios?tipo=universitarios"
                className={styles["footer-link"]}
              >
                Laboratorios universitarios
              </Link>
            </li>
            <li>
              <Link
                href="/laboratorios?tipo=unidades"
                className={styles["footer-link"]}
              >
                Unidades de apoyo
              </Link>
            </li>
            <li>
              <a
                href="https://avisos-privacidad.cic.unam.mx/"
                className={styles["footer-link"]}
                target="_blank"
                rel="noopener"
              >
                Aviso de privacidad
              </a>
            </li>
            <li>
              <a
                href="https://avisos-privacidad.cic.unam.mx/?vMenuAvisoPriv=CCTV"
                className={styles["footer-link"]}
                target="_blank"
                rel="noopener"
              >
                Aviso de privacidad CCTV
              </a>
            </li>
            <li>
              <a
                href="https://labunam.unam.mx/creditos.php"
                className={styles["footer-link"]}
                target="_blank"
                rel="noopener"
              >
                Créditos
              </a>
            </li>
          </ul>
        </nav>

        <nav
          className={styles["footer-column"]}
          aria-labelledby="footer-unam"
        >
          <h2
            id="footer-unam"
            className={styles["footer-title"]}
          >
            UNAM
          </h2>
          <ul className={styles["footer-list"]}>
            <li>
              <a
                href="http://www.unamenlinea.unam.mx/marco"
                className={styles["footer-link"]}
                target="_blank"
                rel="noopener"
              >
                Marco normativo
              </a>
            </li>
            <li>
              <a
                href="http://www.unamenlinea.unam.mx/"
                className={styles["footer-link"]}
                target="_blank"
                rel="noopener"
              >
                UNAM en línea
              </a>
            </li>
            <li>
              <a
                href="http://www.transparencia.unam.mx/"
                className={styles["footer-link"]}
                target="_blank"
                rel="noopener"
              >
                Transparencia UNAM
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles["footer-footer"]}>
        <p>
          Hecho en México. Universidad Nacional Autónoma de México (UNAM), todos los derechos
          reservados {new Date().getFullYear()}.
        </p>
        <p>Coordinación de la Investigación Científica</p>
      </div>
    </footer>
  );
};

export default Footer;
