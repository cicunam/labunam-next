// LabUNAM
// Átomos
// TextArea (campo de texto largo del portal)
// Ángelo M

// Estilos
import styles from "./TextArea.module.css";

// Definición del componente
const TextArea = ({
  className = "", // String Optional - Clases que se suman a las del campo
  rows = 4, // Number Optional - Líneas visibles antes de desplazarse
  ...props // Object Optional - Resto de atributos de textarea (id, name, required, maxLength…)
}) => {
  // Interfaz
  return (
    <textarea
      {...props}
      rows={rows}
      className={`${styles.textarea} ${className}`}
    />
  );
};

export default TextArea;
