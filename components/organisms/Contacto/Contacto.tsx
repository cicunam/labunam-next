import { Campo } from "../../atoms/Campo/Campo";
import { Boton } from "../../atoms/Boton/Boton";
import { Enlace } from "../../atoms/Enlace/Enlace";
import styles from "./Contacto.module.css";

type LaboratorioContacto = { idLab: number; nombre: string; entidad: string; servicios: string[]; sitio: string };
export function Contacto({ laboratorio: lab }: { laboratorio?: LaboratorioContacto }) {
  return <section className={`contenido ${styles.contacto}`} aria-labelledby="contacto-titulo">
    <header className={styles.cabecera}><h1 id="contacto-titulo">{lab ? "Solicitar un servicio" : "Contacto"}</h1><p>{lab ? "Cuéntanos qué necesitas para tu proyecto." : "Encuentra el canal adecuado para tu consulta."}</p></header>
    <div className={styles.columnas}>
      <div className={styles.informacion}>
        {lab ? <>
          <h2>{lab.nombre}</h2><p>{lab.entidad}</p>
          <p>Describe el servicio que te interesa, el tipo de muestra o análisis y los plazos de tu proyecto.</p>
          <Enlace href={`/laboratorios/${lab.idLab}`}>← Volver al laboratorio</Enlace>
          {lab.sitio && <p><a href={lab.sitio} target="_blank" rel="noopener">Consultar el sitio del laboratorio ↗</a></p>}
        </> : <>
        <h2>¿Buscas un servicio de laboratorio?</h2>
        <p>Consulta el catálogo y abre la ficha del laboratorio. Allí encontrarás sus servicios, ubicación y, cuando esté disponible, el enlace a su sitio web.</p>
        <Enlace href="/laboratorios">Explorar laboratorios →</Enlace>
        <h2>Coordinación de la Investigación Científica</h2>
        <address>Circuito de la Investigación Científica S/N<br />Ciudad Universitaria, Alcaldía Coyoacán<br />Ciudad de México, C.P. 04510</address>
        <a href="https://www.cic.unam.mx/" target="_blank" rel="noopener">Visitar el sitio de la CIC ↗</a>
        </>}
      </div>
      <div className={styles.formulario}>
        <h2>{lab ? "Tu solicitud" : "Escríbenos"}</h2>
        <p id="contacto-aviso">{lab ? "El envío de solicitudes aún no está disponible. No se enviará información al laboratorio. Puedes consultar sus canales de contacto en su sitio web, cuando esté disponible." : "El envío de mensajes aún no está disponible. Mientras tanto, puedes consultar los canales de contacto en el sitio de la CIC."}</p>
        <fieldset disabled aria-describedby="contacto-aviso">
          <legend className={styles.oculto}>Datos del mensaje</legend>
          <label htmlFor="contacto-nombre">Nombre<Campo id="contacto-nombre" autoComplete="name" /></label>
          <label htmlFor="contacto-correo">Correo electrónico<Campo id="contacto-correo" type="email" autoComplete="email" /></label>
          {lab && <>
            <label htmlFor="contacto-institucion">Institución o empresa<Campo id="contacto-institucion" autoComplete="organization" /></label>
            <label htmlFor="contacto-servicio">Servicio de interés<select id="contacto-servicio" defaultValue=""><option value="">Selecciona un servicio</option>{lab.servicios.map((servicio, i) => <option key={i} value={servicio}>{servicio}</option>)}<option value="orientacion">Necesito orientación</option></select></label>
          </>}
          <label htmlFor="contacto-mensaje">{lab ? "¿Qué necesitas para tu proyecto?" : "Mensaje"}<textarea id="contacto-mensaje" rows={5} /></label>
          <Boton disabled>Envío no disponible</Boton>
        </fieldset>
      </div>
    </div>
  </section>;
}
