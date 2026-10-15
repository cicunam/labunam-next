// LabUNAM
// Organismos
// ServiceRequest (sección de solicitud de servicio: orientación y formulario)
// Ángelo M

// Componentes
import AppLink from "../../atoms/AppLink/AppLink";
import ServiceRequestForm from "../ServiceRequestForm/ServiceRequestForm";

// Estilos
import styles from "./ServiceRequest.module.css";

// Definición del componente
const ServiceRequest = ({
  laboratorio = null, // Object Optional - Laboratorio asociado: idLab, nombre, entidad y sitio
  catalogos, // Object - Catálogos públicos del formulario de loadRequestCatalogs
}) => {
  // Interfaz
  return (
    <section
      className={`content ${styles.request}`}
      aria-labelledby="request-title"
    >
      <header className={styles.header}>
        <h1 id="request-title">Solicitud de servicio</h1>
        <p>
          Cuéntanos qué necesitas para tu proyecto y te pondremos en contacto con el laboratorio
          adecuado.
        </p>
      </header>
      <div className={styles.columns}>
        <aside
          className={styles.information}
          aria-label={laboratorio ? "Laboratorio seleccionado" : "Antes de empezar"}
        >
          {laboratorio ? (
            <>
              <h2>{laboratorio.nombre}</h2>
              <p>{laboratorio.entidad}</p>
              <p>
                Describe el servicio que te interesa, el tipo de muestra o análisis y los plazos de
                tu proyecto.
              </p>
              <AppLink href={`/laboratorios/${laboratorio.idLab}`}>← Volver al laboratorio</AppLink>
              {laboratorio.sitio && (
                <p>
                  <a
                    href={laboratorio.sitio}
                    target="_blank"
                    rel="noopener"
                  >
                    Consultar el sitio del laboratorio ↗
                  </a>
                </p>
              )}
            </>
          ) : (
            <>
              <h2>¿Ya sabes qué laboratorio te interesa?</h2>
              <p>
                Abre su ficha en el catálogo y elige «Solicitar un servicio» para que tu solicitud
                quede asociada a ese laboratorio.
              </p>
              <AppLink href="/laboratorios">Explorar laboratorios →</AppLink>
              <h2>¿Sólo quieres enviarnos un mensaje, comentario o duda?</h2>
              <p>
                Si no necesitas registrar una solicitud de servicio y prefieres escribirnos
                directamente, usa la sección de contacto.
              </p>
              <AppLink href="/contacto">Ir a contacto →</AppLink>
            </>
          )}
        </aside>
        <div className={styles.form}>
          {/* Al formulario sólo viaja el id: el resto del laboratorio se queda en el servidor. */}
          <ServiceRequestForm
            laboratorio={laboratorio ? { idLab: laboratorio.idLab } : null}
            catalogos={catalogos}
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceRequest;
