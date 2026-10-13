import styles from "./FormField.module.css";
// El control recibe su propio id y, si hay ayuda, aria-describedby={`${controlId}-ayuda`}.
export function FormField({ etiqueta, controlId, obligatorio = false, ayuda = "", ancho = false, children }) {
    return <div className={`${styles.campo} ${ancho ? styles.ancho : ""}`}>
    <label className={styles.etiqueta} htmlFor={controlId}>{etiqueta}{obligatorio && <span className={styles.marca} aria-hidden="true"> *</span>}</label>
    {children}
    {ayuda && <p id={`${controlId}-ayuda`} className={styles.ayuda}>{ayuda}</p>}
  </div>;
}
