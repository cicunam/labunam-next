// LabUNAM
// Átomos
// Button (botón con tamaños del portal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./Button.module.css";

// Definición del componente
const Button = ({
  size = "medium", // String Optional - Tamaño: "small", "medium" o "large"
  className = "", // String Optional - Clases que se suman a las del botón
  type = "button", // String Optional - Tipo nativo: "button", "submit" o "reset"
  ...props // Object Optional - Resto de atributos de button (children, onClick, disabled…)
}) => {
  // Interfaz
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${styles[size]} ${className}`}
    />
  );
};

export default Button;
