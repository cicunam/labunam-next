"use client";

// LabUNAM
// Moléculas
// Autocomplete (campo con lista de sugerencias propia del portal)
// Ángelo M

// Dependencias
import { normalizeText } from "@/lib/texto/texto";

// Mecanismos
import { useAutocomplete } from "./useAutocomplete";

// Estilos
import styles from "./Autocomplete.module.css";

// Definición del componente
// Dibuja el campo y su lista sin contenedor propio: la lista se posiciona respecto al primer
// ancestro con position: relative, que decide quien usa el componente (segmento del buscador,
// campo de formulario…).
const Autocomplete = ({
  id, // String - id del campo; la lista usa `${id}-list` y cada opción `${id}-option-<n>`
  options = [], // Array Optional - Opciones { key, label, detail?, note? }: label se resalta, detail va debajo y note a la derecha
  query = "", // String Optional - Texto escrito; su coincidencia se resalta en cada opción
  onSelect, // Function - Recibe la opción elegida con clic o con Enter
  listLabel = "Sugerencias", // String Optional - Nombre accesible de la lista
  listClassName = "", // String Optional - Clases que se suman a las de la lista (por ejemplo, su ancho)
  icon = null, // ReactNode Optional - Ícono al inicio de cada opción
  inputRef, // Object Optional - Referencia del campo cuando quien lo usa también la necesita
  onFocus, // Function Optional - Se llama al enfocar el campo, después de abrir la lista
  onChange, // Function Optional - Se llama al escribir, con el evento del campo
  onKeyDown, // Function Optional - Se llama con las teclas que el combobox no atiende
  ...props // Object Optional - Resto de atributos del input (name, value, className, placeholder, required…)
}) => {
  // Preparación de datos
  const listId = `${id}-list`;
  const optionId = (index) => `${id}-option-${index}`;

  // Mecanismos
  const { input, list, visible, activeIndex, show, restart, select, handleKeyDown } =
    useAutocomplete({ options, onSelect, optionId, inputRef });

  // Interfaz
  return (
    <>
      <input
        autoComplete="off"
        {...props}
        ref={input}
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={listId}
        aria-activedescendant={visible && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        onFocus={(event) => {
          show();
          onFocus?.(event);
        }}
        onChange={(event) => {
          restart();
          onChange?.(event);
        }}
        onKeyDown={(event) => {
          handleKeyDown(event);
          if (!event.defaultPrevented) {
            onKeyDown?.(event);
          }
        }}
      />
      <ul
        ref={list}
        id={listId}
        className={`${styles.list} ${listClassName}`}
        role="listbox"
        aria-label={listLabel}
        hidden={!visible}
      >
        {options.map((option, index) => (
          <li
            id={optionId(index)}
            key={option.key}
            className={styles.option}
            role="option"
            aria-selected={activeIndex === index}
            // Evita que el campo pierda el foco antes del clic.
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => select(index)}
          >
            {icon}
            <span className={styles.text}>
              <span className={styles.label}>{highlight(option.label, query)}</span>
              {option.detail && <span className={styles.detail}>{option.detail}</span>}
            </span>
            {option.note && <span className={styles.note}>{option.note}</span>}
          </li>
        ))}
      </ul>
    </>
  );
};

// Utilidades
// Marca en negritas la primera coincidencia del texto escrito, sin distinguir acentos.
function highlight(
  text, // String - Texto de la opción
  query, // String - Texto escrito
) {
  const wanted = normalizeText(query);
  const start = wanted ? normalizeText(text).indexOf(wanted) : -1;
  if (start < 0) {
    return text;
  }
  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, start + wanted.length)}</mark>
      {text.slice(start + wanted.length)}
    </>
  );
}

export default Autocomplete;
