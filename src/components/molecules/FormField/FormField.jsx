// LabUNAM
// Moléculas
// FormField (etiqueta, control y ayuda de un campo de formulario)
// Ángelo M

// Estilos
import styles from "./FormField.module.css";

// Definición del componente
// El control recibe su propio id y, si hay ayuda, aria-describedby={`${controlId}-hint`}.
const FormField = ({
  label, // String - Texto de la etiqueta
  controlId, // String - id del control que etiqueta
  required = false, // Boolean Optional - Muestra la marca de obligatorio
  hint = "", // String Optional - Texto de ayuda bajo el control; su id es `${controlId}-hint`
  wide = false, // Boolean Optional - Ocupa todo el ancho de la retícula de la sección
  children, // ReactNode - Control del campo (Input, Select, TextArea…)
}) => {
  // Interfaz
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <label
        className={styles.label}
        htmlFor={controlId}
      >
        {label}
        {required && (
          <span
            className={styles.mark}
            aria-hidden="true"
          >
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p
          id={`${controlId}-hint`}
          className={styles.hint}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default FormField;
