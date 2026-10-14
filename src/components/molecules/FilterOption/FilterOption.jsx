// LabUNAM
// Moléculas
// FilterOption (opción de radio con su conteo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./FilterOption.module.css";

// Definición del componente
const FilterOption = ({
  name, // String - Nombre del grupo de radios; es el eje del filtro
  value, // String - Clave de la opción
  label, // String - Texto visible
  total, // Number Optional - Laboratorios que daría esta opción; con 0 y sin seleccionar se deshabilita
  selected, // Boolean - Opción marcada
  onChange, // Function - Recibe el evento change del radio
}) => {
  // Preparación de datos
  const disabled = total === 0 && !selected;

  // Interfaz
  return (
    <label
      className={styles.option}
      data-empty={disabled || undefined}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={onChange}
      />

      <span>{label}</span>
      {total !== undefined && (
        <span
          className={styles.count}
          aria-label={`${total} resultados`}
        >
          {total}
        </span>
      )}
    </label>
  );
};

export default FilterOption;
