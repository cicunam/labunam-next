import { AppLink } from "../../atoms/AppLink/AppLink";
import styles from "./ServiceRequest.module.css";
export function ServiceRequest({ laboratorio: lab }) {
    return <section className={`contenido ${styles.solicitud}`} aria-labelledby="solicitud-titulo">
    <header className={styles.cabecera}><h1 id="solicitud-titulo">Solicitud de servicio</h1><p>Cuéntanos qué necesitas para tu proyecto y te pondremos en contacto con el laboratorio adecuado.</p></header>
    <div className={styles.columnas}>
      <div className={styles.informacion}>
        {lab ? <>
          <h2>{lab.nombre}</h2><p>{lab.entidad}</p>
          <p>Describe el servicio que te interesa, el tipo de muestra o análisis y los plazos de tu proyecto.</p>
          <AppLink href={`/laboratorios/${lab.idLab}`}>← Volver al laboratorio</AppLink>
          {lab.sitio && <p><a href={lab.sitio} target="_blank" rel="noopener">Consultar el sitio del laboratorio ↗</a></p>}
        </> : <>
          <h2>¿Ya sabes qué laboratorio te interesa?</h2>
          <p>Abre su ficha en el catálogo y elige «Solicitar un servicio» para que tu solicitud quede asociada a ese laboratorio.</p>
          <AppLink href="/laboratorios">Explorar laboratorios →</AppLink>
        </>}
      </div>
      {/* El formulario se incorporará al adaptar la versión anterior; mientras tanto no se recaba ningún dato. */}
      <div className={styles.pendiente}>
        <h2>Tu solicitud</h2>
        <p>El formulario de solicitud estará disponible próximamente. Por ahora no se recibe ni se envía información.</p>
      </div>
    </div>
  </section>;
}
