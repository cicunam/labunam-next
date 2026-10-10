// LabUNAM
// Moléculas
// SearchField (segmento del buscador con etiqueta y control)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./SearchField.module.css";

// Definición del componente
const SearchField = ({
  label, // String - Texto de la etiqueta
  controlId, // String - id del control al que apunta la etiqueta
  wide = false, // Boolean Optional - Ocupa el doble de ancho en pantallas anchas
  children, // ReactNode - El control del segmento (input o select)
}) => {
  // Interfaz
  return (
    <div className={`${styles.segment} ${wide ? styles.width : ""}`}>
      <label
        className={styles.label}
        htmlFor={controlId}
      >
        {label}
      </label>
      <div className={styles.control}>{children}</div>
    </div>
  );
};

export default SearchField;
