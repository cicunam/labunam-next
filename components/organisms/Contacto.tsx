import { Campo } from "../atoms/Campo";
import { Boton } from "../atoms/Boton";
import { Enlace } from "../atoms/Enlace";
import styles from "./Contacto.module.css";

export function Contacto() {
  return <section className={`contenido ${styles.contacto}`} aria-labelledby="contacto-titulo">
    <header className={styles.cabecera}><h1 id="contacto-titulo">Contacto</h1><p>Encuentra el canal adecuado para tu consulta.</p></header>
    <div className={styles.columnas}>
      <div className={styles.informacion}>
        <h2>¿Buscas un servicio de laboratorio?</h2>
        <p>Consulta el catálogo y abre la ficha del laboratorio. Allí encontrarás sus servicios, ubicación y, cuando esté disponible, el enlace a su sitio web.</p>
        <Enlace href="/laboratorios">Explorar laboratorios →</Enlace>
        <h2>Coordinación de la Investigación Científica</h2>
        <address>Circuito de la Investigación Científica S/N<br />Ciudad Universitaria, Alcaldía Coyoacán<br />Ciudad de México, C.P. 04510</address>
        <a href="https://www.cic.unam.mx/" target="_blank" rel="noopener">Visitar el sitio de la CIC ↗</a>
      </div>
      <div className={styles.formulario}>
        <h2>Escríbenos</h2>
        <p id="contacto-aviso">El envío de mensajes aún no está disponible. Mientras tanto, puedes consultar los canales de contacto en el sitio de la CIC.</p>
        <fieldset disabled aria-describedby="contacto-aviso">
          <legend className={styles.oculto}>Datos del mensaje</legend>
          <label htmlFor="contacto-nombre">Nombre<Campo id="contacto-nombre" autoComplete="name" /></label>
          <label htmlFor="contacto-correo">Correo electrónico<Campo id="contacto-correo" type="email" autoComplete="email" /></label>
          <label htmlFor="contacto-mensaje">Mensaje<textarea id="contacto-mensaje" rows={5} /></label>
          <Boton disabled>Envío no disponible</Boton>
        </fieldset>
      </div>
    </div>
  </section>;
}
