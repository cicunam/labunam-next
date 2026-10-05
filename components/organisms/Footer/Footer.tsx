import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles["footer"]}>

      <div className={styles["footer-contenido"]}>

        <div className={styles["footer-marca"]}>
          <Link href="/" className={styles["footer-logo"]}><img src="/assets/logos/labunam.webp" width={170} height={50} alt="LabUNAM" /></Link>
          <p className={styles["footer-lema"]}>
            Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.
          </p>
          <a href="https://www.unam.mx/" className={styles["footer-logo"] + " " + styles["footer-logo-unam"]} target="_blank" rel="noopener">
            <img src="/assets/logos/unam.webp" width={320} height={85} alt="Universidad Nacional Autónoma de México" />
          </a>
        </div>

        <section className={styles["footer-columna"]} aria-labelledby="footer-contacto">
          <h2 id="footer-contacto" className={styles["footer-titulo"]}>Contacto</h2>
          <address className={styles["footer-direccion"]}>
            Circuito de la Investigación Científica S/N<br />
            Ciudad Universitaria, Alcaldía Coyoacán<br />
            Ciudad de México, C.P. 04510
          </address>
          <a href="https://www.cic.unam.mx/" className={styles["footer-enlace"]} target="_blank" rel="noopener">Coordinación de la Investigación Científica</a>
        </section>

        <nav className={styles["footer-columna"]} aria-labelledby="footer-vinculos">
          <h2 id="footer-vinculos" className={styles["footer-titulo"]}>Vínculos rápidos</h2>
          <ul className={styles["footer-lista"]}>
            <li><Link href="/laboratorios?tipo=nacionales" className={styles["footer-enlace"]}>Laboratorios nacionales</Link></li>
            <li><Link href="/laboratorios?tipo=universitarios" className={styles["footer-enlace"]}>Laboratorios universitarios</Link></li>
            <li><Link href="/laboratorios?tipo=unidades" className={styles["footer-enlace"]}>Unidades de apoyo</Link></li>
            <li><a href="https://avisos-privacidad.cic.unam.mx/" className={styles["footer-enlace"]} target="_blank" rel="noopener">Aviso de privacidad</a></li>
            <li><a href="https://avisos-privacidad.cic.unam.mx/?vMenuAvisoPriv=CCTV" className={styles["footer-enlace"]} target="_blank" rel="noopener">Aviso de privacidad CCTV</a></li>
            <li><a href="https://labunam.unam.mx/creditos.php" className={styles["footer-enlace"]} target="_blank" rel="noopener">Créditos</a></li>
          </ul>
        </nav>

        <nav className={styles["footer-columna"]} aria-labelledby="footer-unam">
          <h2 id="footer-unam" className={styles["footer-titulo"]}>UNAM</h2>
          <ul className={styles["footer-lista"]}>
            <li><a href="http://www.unamenlinea.unam.mx/marco" className={styles["footer-enlace"]} target="_blank" rel="noopener">Marco normativo</a></li>
            <li><a href="http://www.unamenlinea.unam.mx/" className={styles["footer-enlace"]} target="_blank" rel="noopener">UNAM en línea</a></li>
            <li><a href="http://www.transparencia.unam.mx/" className={styles["footer-enlace"]} target="_blank" rel="noopener">Transparencia UNAM</a></li>
          </ul>
        </nav>

      </div>

      <div className={styles["footer-pie"]}>
        <p>Hecho en México. Universidad Nacional Autónoma de México (UNAM), todos los derechos reservados {new Date().getFullYear()}.</p>
        <p>Coordinación de la Investigación Científica</p>
      </div>

    </footer>
  );
}
