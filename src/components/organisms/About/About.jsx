import styles from "./About.module.css";

export function About() {
  return (
    <section
      className={`contenido ${styles.institucional}`}
      aria-labelledby="institucional-titulo"
    >
      <div className={styles.columnas}>
        <div>
          <h2
            id="institucional-titulo"
            className="banda-titulo"
          >
            ¿Qué es LabUNAM?
          </h2>
          <p>
            Como parte del compromiso que la UNAM tiene de vincular sus tareas para beneficio de la
            sociedad, la Coordinación de la Investigación Científica (CIC) ha desarrollado una
            plataforma tecnológica, a través de la cual se muestra el potencial tecnológico, de
            investigación y formación de recursos humanos con que cuenta la UNAM, a la vez que
            difunde el trabajo de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de
            los Subsistemas de la Investigación Científica, de Humanidades y de las Facultades y
            Escuelas.
          </p>
          <p>
            Mediante una interacción dinámica, LabUNAM permite a los responsables mantener
            actualizada la información más relevante de cada uno de los laboratorios, funcionando
            también como un enlace con la Secretaría de Ciencia, Humanidades, Tecnología e
            Innovación (SECIHTI).
          </p>
        </div>
        <img
          src="/assets/images/laboratorio-abc.jpeg"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.par}>
        <div>
          <h3>Misión</h3>
          <ul>
            <li>
              Fortalecer los programas de investigación científica, humanística y el desarrollo
              tecnológico vinculado a las necesidades del país.
            </li>
            <li>
              Constituirse como una herramienta fundamental para difundir el potencial tecnológico,
              de investigación, de formación de recursos humanos y de servicios con que cuenta la
              UNAM.
            </li>
            <li>
              Funcionar como enlace entre los Laboratorios Nacionales, Universitarios y Unidades de
              Apoyo a la Investigación y el cuerpo de investigación, docencia y de servicios de la
              UNAM. Asimismo, busca actuar como enlace con los sectores público, social y privado
              del país.
            </li>
          </ul>
        </div>
        <div>
          <h3>Visión</h3>
          <ul>
            <li>
              LabUNAM es una plataforma tecnológica de la UNAM a través de la cual los sectores
              público, social y privado pueden observar la infraestructura de investigación,
              docencia y servicios con que cuenta la UNAM, así como las capacidades y servicios que
              pueden ofrecer sus laboratorios, vinculados a las necesidades del país.
            </li>
            <li>
              Es una herramienta fundamental para promover el modelo de colaboración entre los
              diversos grupos de investigación y docencia al interior y al exterior de la UNAM. El
              modelo de adquisición y uso de equipo compartido se generaliza.
            </li>
            <li>
              Constituye un importante medio de enlace entre los laboratorios de la UNAM y los
              sectores productivos públicos, sociales y privados, obteniendo recursos con los que se
              garantiza la sostenibilidad financiera de los laboratorios.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
