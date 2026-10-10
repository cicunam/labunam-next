// LabUNAM
// Organismos
// Contact (contacto general o solicitud de servicio a un laboratorio)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import AppLink from "../../atoms/AppLink/AppLink";

// Estilos
import styles from "./Contact.module.css";

// Definición del componente
const Contact = ({
  laboratorio: lab, // Object Optional - Laboratorio de getContactDetails (idLab, nombre, entidad, servicios, sitio); sin él muestra el contacto general
}) => {
  // Interfaz
  return (
    <section
      className={`content ${styles.contact}`}
      aria-labelledby="contact-title"
    >
      <header className={styles.header}>
        <h1 id="contact-title">{lab ? "Solicitar un servicio" : "Contacto"}</h1>
        <p>
          {lab
            ? "Cuéntanos qué necesitas para tu proyecto."
            : "Encuentra el canal adecuado para tu query."}
        </p>
      </header>
      <div className={styles.columns}>
        <div className={styles.information}>
          {lab ? (
            <>
              <h2>{lab.nombre}</h2>
              <p>{lab.entidad}</p>
              <p>
                Describe el servicio que te interesa, el tipo de muestra o análisis y los plazos de
                tu proyecto.
              </p>
              <AppLink href={`/laboratorios/${lab.idLab}`}>← Volver al laboratorio</AppLink>
              {lab.sitio && (
                <p>
                  <a
                    href={lab.sitio}
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
              <h2>¿Buscas un servicio de laboratorio?</h2>
              <p>
                Consulta el catálogo y abre la ficha del laboratorio. Allí encontrarás sus
                servicios, ubicación y, cuando esté disponible, el enlace a su sitio web.
              </p>
              <AppLink href="/laboratorios">Explorar laboratorios →</AppLink>
              <h2>Coordinación de la Investigación Científica</h2>
              <address>
                Circuito de la Investigación Científica S/N
                <br />
                Ciudad Universitaria, Alcaldía Coyoacán
                <br />
                Ciudad de México, C.P. 04510
              </address>
              <a
                href="https://www.cic.unam.mx/"
                target="_blank"
                rel="noopener"
              >
                Visitar el sitio de la CIC ↗
              </a>
            </>
          )}
        </div>
        <div className={styles.form}>
          <h2>{lab ? "Tu solicitud" : "Escríbenos"}</h2>
          <p id="contact-notice">
            {lab
              ? "El envío de solicitudes aún no está disponible. No se enviará información al laboratorio. Puedes consultar sus canales de contacto en su sitio web, cuando esté disponible."
              : "El envío de mensajes aún no está disponible. Mientras tanto, puedes consultar los canales de contacto en el sitio de la CIC."}
          </p>
          <fieldset
            disabled
            aria-describedby="contact-notice"
          >
            <legend className={styles.hidden}>Datos del mensaje</legend>
            <label htmlFor="contact-name">
              Nombre
              <Input
                id="contact-name"
                autoComplete="name"
              />
            </label>
            <label htmlFor="contact-email">
              Correo electrónico
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
              />
            </label>
            {lab && (
              <>
                <label htmlFor="contact-institution">
                  Institución o empresa
                  <Input
                    id="contact-institution"
                    autoComplete="organization"
                  />
                </label>
                <label htmlFor="contact-service">
                  Servicio de interés
                  <select
                    id="contact-service"
                    defaultValue=""
                  >
                    <option value="">Selecciona un servicio</option>
                    {lab.servicios.map((servicio, i) => (
                      <option
                        key={i}
                        value={servicio}
                      >
                        {servicio}
                      </option>
                    ))}
                    <option value="orientacion">Necesito orientación</option>
                  </select>
                </label>
              </>
            )}
            <label htmlFor="contact-message">
              {lab ? "¿Qué necesitas para tu proyecto?" : "Mensaje"}
              <textarea
                id="contact-message"
                rows={5}
              />
            </label>
            <Button disabled>Envío no disponible</Button>
          </fieldset>
        </div>
      </div>
    </section>
  );
};

export default Contact;
