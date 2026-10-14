// LabUNAM
// Átomos
// Input (campo de texto del portal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./Input.module.css";

// Definición del componente
const Input = ({
  integrated = false, // Boolean Optional - Quita borde, fondo y relleno para usarlo dentro de otro control
  className = "", // String Optional - Clases que se suman a las del campo
  ...props // Object Optional - Resto de atributos de input (id, name, type, value, onChange…)
}) => {
  // Interfaz
  return (
    <input
      {...props}
      className={`${styles.input} ${integrated ? styles.integrated : ""} ${className}`}
    />
  );
};

export default Input;
