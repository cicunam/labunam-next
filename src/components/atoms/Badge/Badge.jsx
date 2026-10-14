// LabUNAM
// Átomos
// Badge (etiqueta corta con punto de color)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./Badge.module.css";

// Definición del componente
const Badge = ({
  tone = "neutral", // String Optional - Tono de color: "blue", "green" o "neutral"; cualquier otro conserva el tono base
  className = "", // String Optional - Clases que se suman a las de la etiqueta
  ...props // Object Optional - Resto de atributos de span (children, aria-*…)
}) => {
  // Interfaz
  return (
    <span
      {...props}
      className={`${styles.badge} ${styles[tone]} ${className}`}
    />
  );
};

export default Badge;
