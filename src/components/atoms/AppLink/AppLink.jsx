// LabUNAM
// Átomos
// AppLink (enlace interno con el estilo del portal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";

// Estilos
import styles from "./AppLink.module.css";

// Definición del componente
const AppLink = ({
  href, // String - Ruta interna o URL de destino
  className = "", // String Optional - Clases que se suman a las del enlace
  ...props // Object Optional - Resto de atributos de Link de Next (children, aria-*, prefetch…)
}) => {
  // Interfaz
  return (
    <Link
      {...props}
      href={href}
      className={`${styles.link} ${className}`}
    />
  );
};

export default AppLink;
