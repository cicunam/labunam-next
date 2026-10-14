// LabUNAM
// Moléculas
// FormSection (grupo de campos con título y retícula de dos columnas)
// Ángelo M

// Estilos
import styles from "./FormSection.module.css";

// Definición del componente
const FormSection = ({
  title, // String - Título visible del grupo de campos
  children, // ReactNode - Campos de la sección
}) => {
  // Interfaz
  return (
    <fieldset className={styles.section}>
      <legend className={styles.title}>{title}</legend>
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
};

export default FormSection;
