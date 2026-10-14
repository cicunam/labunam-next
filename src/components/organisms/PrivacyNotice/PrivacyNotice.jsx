import styles from "./PrivacyNotice.module.css";
// Texto breve que remite al aviso integral de la CIC; no se copia el aviso para no desactualizarlo.
// Pendiente de revisión institucional antes de habilitar el envío.
export function PrivacyNotice({ finalidad = "atender y dar seguimiento a tu solicitud de servicio" }) {
    return <p className={styles.aviso}>
    La Coordinación de la Investigación Científica de la UNAM es responsable del tratamiento de los datos personales que proporciones en este formulario. Los usaremos para {finalidad}. Consulta el{" "}
    <a href="https://avisos-privacidad.cic.unam.mx/" target="_blank" rel="noopener">aviso de privacidad integral<span aria-hidden="true"> ↗</span><span className={styles.oculto}> (se abre en una pestaña nueva)</span></a>.
  </p>;
}
