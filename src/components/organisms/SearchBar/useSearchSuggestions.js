"use client";

// LabUNAM
// Mecanismos
// useSearchSuggestions (sugerencias, historial y atajo de teclado del SearchBar)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useEffect, useRef, useState } from "react";
import {
  saveRecentSearch,
  readRecentSearches,
  getSearchOptions,
} from "@/lib/sugerencias/sugerencias";

// Definición del mecanismo
// Gestiona sugerencias, historial local y el atajo /; no consulta el catálogo. La lista, la
// opción activa y la navegación con teclado las resuelve la molécula Autocomplete.
export function useSearchSuggestions({
  criteria, // Object - Criterios activos; criteria.q es el texto inicial del campo
  suggestions, // Array - Textos (String) del catálogo que se ofrecen como sugerencia
}) {
  const [q, setQ] = useState(criteria.q ?? "");
  const [recentSearches, setRecentSearches] = useState([]);
  const input = useRef(null);
  const form = useRef(null);
  const options = getSearchOptions(q, suggestions, recentSearches);
  useEffect(() => {
    // El atajo / sólo actúa fuera de campos editables y diálogos abiertos.
    function handleKeyDown(event) {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (document.querySelector("dialog[open]")) {
        return;
      }
      const target = event.target;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
        return;
      }
      event.preventDefault();
      input.current?.focus();
      input.current?.select();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // requestSubmit lee el formulario antes del siguiente render de React.
  // Escribimos la sugerencia en el input para enviar el texto elegido, no el anterior.
  function selectSuggestion(text) {
    if (input.current) {
      input.current.value = text;
    }
    saveRecentSearch(text);
    form.current?.requestSubmit();
  }

  function handleSearchChange(event) {
    setQ(event.target.value);
  }
  function handleSearchFocus() {
    setRecentSearches(readRecentSearches());
  }
  function clearSearch() {
    setQ("");
    input.current?.focus();
  }
  function handleSubmit() {
    saveRecentSearch(input.current?.value ?? "");
  }

  return {
    q,
    input,
    form,
    options,
    selectSuggestion,
    handleSearchChange,
    handleSearchFocus,
    clearSearch,
    handleSubmit,
  };
}
