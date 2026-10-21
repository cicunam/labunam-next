"use client";

// LabUNAM
// Moléculas
// SuggestionField (campo de formulario con sugerencias del autocompletado del portal)
// Ángelo M

// Dependencias
import { useEffect, useRef } from "react";
import { filterByName } from "@/lib/coincidencias/coincidencias";

// Componentes
import FormField from "../FormField/FormField";
import Autocomplete from "../Autocomplete/Autocomplete";
import Input from "../../atoms/Input/Input";

// Estilos
import styles from "./SuggestionField.module.css";

// Definición del componente
// Quien lo usa decide si el texto escrito es válido; el campo sólo traduce esa decisión
// al mensaje de validación del navegador.
const SuggestionField = ({
  label, // String - Texto de la etiqueta
  controlId, // String - id del campo; la lista usa `${controlId}-list`
  options = [], // Array Optional - Sugerencias { clave, nombre, detail? }; detail se muestra debajo del nombre
  filter = true, // Boolean Optional - Filtra options con el texto escrito; falso cuando ya llegan filtradas del servidor
  value = "", // String Optional - Texto escrito
  onChange, // Function Optional - Recibe el texto nuevo, al escribir o al elegir una sugerencia
  onSelect, // Function Optional - Recibe la opción original { clave, nombre… } al elegirla de la lista
  required = false, // Boolean Optional - Exige escribir algo
  valid = true, // Boolean Optional - Si es falso, el navegador bloquea el envío con message
  message = "Elige una opción de la lista.", // String Optional - Mensaje cuando valid es falso
  hint = "", // String Optional - Texto de ayuda bajo el campo
  wide = false, // Boolean Optional - Ocupa todo el ancho de la retícula de la sección
  placeholder = "", // String Optional - Texto de ejemplo dentro del campo
}) => {
  // Referencias y estado
  const field = useRef(null);
  useEffect(() => {
    field.current?.setCustomValidity(valid ? "" : message);
  }, [valid, message]);

  // Preparación de datos
  const shown = filter ? filterByName(options, value) : options;
  const visibleOptions = shown.map((option) => ({
    key: option.clave,
    label: option.nombre,
    detail: option.detail,
  }));

  // Gestores de evento
  // Al elegir, el campo muestra el nombre y quien lo usa recibe la opción completa (con su clave),
  // para distinguir opciones con el mismo nombre.
  function handleSelect(
    selected, // Object - Opción de Autocomplete { key, label }
  ) {
    const option = shown.find((item) => item.clave === selected.key);
    onChange?.(selected.label);
    if (option) {
      onSelect?.(option);
    }
  }

  // Interfaz
  return (
    <FormField
      label={label}
      controlId={controlId}
      required={required}
      hint={hint}
      wide={wide}
    >
      {/* La lista se ancla debajo del campo y no debajo de la ayuda. */}
      <div className={styles.control}>
        <Autocomplete
          inputComponent={Input}
          inputRef={field}
          id={controlId}
          options={visibleOptions}
          query={value}
          onSelect={handleSelect}
          listLabel={`Sugerencias de ${label.toLowerCase()}`}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
          placeholder={placeholder}
          aria-describedby={hint ? `${controlId}-hint` : undefined}
        />
      </div>
    </FormField>
  );
};

export default SuggestionField;
