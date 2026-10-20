// LabUNAM
// Organismos
// ServiceRequest (sección de solicitud de servicio: orientación y formulario)
// Ángelo M

// Componentes
import AppLink from "../../atoms/AppLink/AppLink";
import ServiceRequestForm from "../ServiceRequestForm/ServiceRequestForm";
import ContactLink from "../ContactLink/ContactLink";

// Estilos
import styles from "./ServiceRequest.module.css";

// Definición del componente
const ServiceRequest = ({
  laboratorio = null, // Object Optional - Laboratorio inicial de ?laboratorio: idLab, nombre y entidad
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
        {/* El laboratorio elegido se muestra en el campo «Laboratorio de interés», que se actualiza
            al cambiarlo; aquí sólo queda la orientación general. */}
        <aside
          className={styles.information}
          aria-label="Antes de empezar"
        >
          <p>
            Indica en «Laboratorio de interés» el laboratorio que buscas. Si todavía no lo sabes,
            déjalo vacío y te orientaremos, o{" "}
            <AppLink href="/laboratorios">explora el catálogo</AppLink>.
          </p>
          <h2>¿Sólo quieres enviarnos un mensaje, comentario o duda?</h2>
          <p>
            Si no necesitas registrar una solicitud de servicio y prefieres escribirnos
            directamente, usa el formulario de contacto.
          </p>
          <ContactLink>Ir a contacto →</ContactLink>
        </aside>
        <div className={styles.form}>
          <ServiceRequestForm
            laboratorio={laboratorio}
            catalogos={catalogos}
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceRequest;
