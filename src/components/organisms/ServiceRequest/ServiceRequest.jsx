import { AppLink } from "../../atoms/AppLink/AppLink";
import { ServiceRequestForm } from "../ServiceRequestForm/ServiceRequestForm";
import styles from "./ServiceRequest.module.css";
export function ServiceRequest({ laboratorio: lab, catalogos }) {
    return <section className={`contenido ${styles.solicitud}`} aria-labelledby="solicitud-titulo">
    <header className={styles.cabecera}><h1 id="solicitud-titulo">Solicitud de servicio</h1><p>Cuéntanos qué necesitas para tu proyecto y te pondremos en contacto con el laboratorio adecuado.</p></header>
    <div className={styles.columnas}>
      <aside className={styles.informacion} aria-label={lab ? "Laboratorio seleccionado" : "Antes de empezar"}>
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
      </aside>
      <div className={styles.formulario}>
        <ServiceRequestForm laboratorio={lab ? { idLab: lab.idLab } : null} catalogos={catalogos}/>
      </div>
    </div>
  </section>;
}
