// LabUNAM
// Moléculas
// ActiveChip (filtro activo que se quita al pulsarlo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import AppLink from "../../atoms/AppLink/AppLink";
import Icon from "../../atoms/Icon/Icon";

// Estilos
import styles from "./ActiveChip.module.css";

// Definición del componente
const ActiveChip = ({
  href, // String - URL del catálogo sin este filtro
  label, // String - Nombre del eje del filtro, para el texto accesible
  value, // String - Valor visible del filtro
}) => {
  // Interfaz
  return (
    <AppLink
      href={href}
      className={styles.chip}
      aria-label={`Quitar ${label}: ${value}`}
    >
      {value}
      <Icon
        name="close"
        size={12}
      />
    </AppLink>
  );
};

export default ActiveChip;
