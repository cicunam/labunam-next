// LabUNAM
// Organismos
// PrivacyNotice (texto breve de privacidad con enlace al aviso integral de la CIC)
// Ángelo M

// Estilos
import styles from "./PrivacyNotice.module.css";

// Definición del componente
// Remite al aviso integral de la CIC; no se copia el aviso para no desactualizarlo.
// Pendiente de revisión institucional antes de habilitar el envío.
const PrivacyNotice = ({
  purpose = "atender y dar seguimiento a tu solicitud de servicio", // String Optional - Finalidad del tratamiento, completa la frase «Los usaremos para…»
}) => {
  // Interfaz
  return (
    <p className={styles.notice}>
      La Coordinación de la Investigación Científica de la UNAM es responsable del tratamiento de
      los datos personales que proporciones en este formulario. Los usaremos para {purpose}.
      Consulta el{" "}
      <a
        href="https://avisos-privacidad.cic.unam.mx/"
        target="_blank"
        rel="noopener"
      >
        aviso de privacidad integral<span aria-hidden="true"> ↗</span>
        <span className={styles.hidden}> (se abre en una pestaña nueva)</span>
      </a>
      .
    </p>
  );
};

export default PrivacyNotice;
