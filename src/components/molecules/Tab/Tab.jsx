// LabUNAM
// Moléculas
// Tab (pestaña accesible de una lista de pestañas)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./Tab.module.css";

// Definición del componente
const Tab = ({
  id, // String - id de la pestaña; el panel lo usa en aria-labelledby
  panelId, // String - id del panel que controla
  selected, // Boolean - Pestaña activa; sólo ella entra en el recorrido con Tab
  className = "", // String Optional - Clases que se suman a las de la pestaña
  ...props // Object Optional - Resto de atributos de button (children, onClick, onKeyDown…)
}) => {
  // Interfaz
  return (
    <button
      {...props}
      id={id}
      type="button"
      role="tab"
      aria-controls={panelId}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={`${styles.tab} ${className}`}
    />
  );
};

export default Tab;
