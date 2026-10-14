"use client";

// LabUNAM
// Moléculas
// SuggestionField (campo de texto con sugerencias nativas del navegador)
// Ángelo M

// Dependencias
import { useEffect, useRef } from "react";

// Componentes
import FormField from "../FormField/FormField";
import Input from "../../atoms/Input/Input";

// Definición del componente
// Quien lo usa decide si el texto escrito es válido; el campo sólo traduce esa decisión
// al mensaje de validación del navegador.
const SuggestionField = ({
  label, // String - Texto de la etiqueta
  controlId, // String - id del campo; la lista de sugerencias usa `${controlId}-options`
  options = [], // Array Optional - Sugerencias { clave, nombre, detail? }; detail se muestra junto al nombre
  value = "", // String Optional - Texto escrito
  onChange, // Function Optional - Recibe el texto nuevo
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

  // Interfaz
  return (
    <FormField
      label={label}
      controlId={controlId}
      required={required}
      hint={hint}
      wide={wide}
    >
      <Input
        ref={field}
        id={controlId}
        list={`${controlId}-options`}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        aria-describedby={hint ? `${controlId}-hint` : undefined}
      />
      <datalist id={`${controlId}-options`}>
        {options.map(({ clave, nombre, detail }) => (
          <option
            key={clave}
            value={nombre}
            label={detail || undefined}
          />
        ))}
      </datalist>
    </FormField>
  );
};

export default SuggestionField;
