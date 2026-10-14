// LabUNAM
// Moléculas
// ChoiceGroup (grupo de opciones de radio con leyenda)
// Ángelo M

// Estilos
import styles from "./ChoiceGroup.module.css";

// Definición del componente
const ChoiceGroup = ({
  legend, // String - Pregunta o título del grupo
  name, // String - Nombre del grupo de radios que viaja con el formulario
  options = [], // Array Optional - Opciones { id, label }
  required = false, // Boolean Optional - Exige elegir una opción
  value, // String Optional - id de la opción marcada; sin él, el grupo no es controlado
  onChange, // Function Optional - Recibe el id de la opción elegida
  wide = true, // Boolean Optional - Ocupa todo el ancho de la retícula de la sección
}) => {
  // Interfaz
  return (
    <fieldset className={`${styles.group} ${wide ? styles.wide : ""}`}>
      <legend className={styles.legend}>
        {legend}
        {required && (
          <span
            className={styles.mark}
            aria-hidden="true"
          >
            {" "}
            *
          </span>
        )}
      </legend>
      <div className={styles.options}>
        {options.map(({ id, label }) => (
          <label
            key={id}
            className={styles.option}
          >
            <input
              type="radio"
              name={name}
              value={id}
              required={required}
              checked={value === undefined ? undefined : value === id}
              onChange={onChange && (() => onChange(id))}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default ChoiceGroup;
