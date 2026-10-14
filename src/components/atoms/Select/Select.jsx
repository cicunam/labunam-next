// LabUNAM
// Átomos
// Select (lista desplegable del portal)
// Ángelo M

// Estilos
import styles from "./Select.module.css";

// Definición del componente
const Select = ({
  className = "", // String Optional - Clases que se suman a las de la lista
  children, // ReactNode - Elementos option de la lista
  ...props // Object Optional - Resto de atributos de select (id, name, value, onChange, required…)
}) => {
  // Interfaz
  return (
    <select
      {...props}
      className={`${styles.select} ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
