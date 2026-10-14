"use client";
import { useEffect, useRef } from "react";
import FormField from "../FormField/FormField";
import Input from "../../atoms/Input/Input";
// Campo de texto con sugerencias nativas. Quien lo usa decide si el texto escrito es válido;
// el campo sólo traduce esa decisión al mensaje de validación del navegador.
const SuggestionField = ({ etiqueta, controlId, opciones = [], valor = "", onChange, obligatorio = false, valido = true, mensaje = "Elige una opción de la lista.", ayuda = "", ancho = false, placeholder = "" }) => {
    const campo = useRef(null);
    useEffect(() => { campo.current?.setCustomValidity(valido ? "" : mensaje); }, [valido, mensaje]);
    return <FormField etiqueta={etiqueta} controlId={controlId} obligatorio={obligatorio} ayuda={ayuda} ancho={ancho}>
    <Input ref={campo} id={controlId} list={`${controlId}-opciones`} value={valor} onChange={(event) => onChange?.(event.target.value)} required={obligatorio} placeholder={placeholder} autoComplete="off" aria-describedby={ayuda ? `${controlId}-ayuda` : undefined}/>
    <datalist id={`${controlId}-opciones`}>
      {opciones.map(({ clave, nombre, detalle }) => <option key={clave} value={nombre} label={detalle || undefined}/>)}
    </datalist>
  </FormField>;
};

export default SuggestionField;
