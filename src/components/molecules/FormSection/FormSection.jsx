import styles from "./FormSection.module.css";
const FormSection = ({ titulo, children }) => {
    return <fieldset className={styles.seccion}>
    <legend className={styles.titulo}>{titulo}</legend>
    <div className={styles.campos}>{children}</div>
  </fieldset>;
};

export default FormSection;
