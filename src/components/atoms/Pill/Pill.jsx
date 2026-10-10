// LabUNAM
// Átomos
// Pill (pastilla seleccionable)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./Pill.module.css";

// Definición del componente
const Pill = ({
  active = false, // Boolean Optional - Marca la pastilla como seleccionada (fondo negro)
  className = "", // String Optional - Clases que se suman a las de la pastilla
  ...props // Object Optional - Resto de atributos de span (children, aria-*…)
}) => {
  // Interfaz
  return (
    <span
      {...props}
      data-active={active || undefined}
      className={`${styles.pill} ${className}`}
    />
  );
};

export default Pill;
