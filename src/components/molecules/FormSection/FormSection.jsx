import styles from "./FormSection.module.css";
export function FormSection({ titulo, children }) {
    return <fieldset className={styles.seccion}>
    <legend className={styles.titulo}>{titulo}</legend>
    <div className={styles.campos}>{children}</div>
  </fieldset>;
}
