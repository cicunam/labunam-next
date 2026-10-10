"use client";

// LabUNAM
// Mecanismos
// useSearchSuggestions (sugerencias, historial y teclado del SearchBar)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useEffect, useRef, useState } from "react";
import {
  saveRecentSearch,
  readRecentSearches,
  getSearchOptions,
} from "@/lib/sugerencias/sugerencias";

// Definición del mecanismo
// Gestiona sugerencias, historial local y teclado; no consulta el catálogo.
export function useSearchSuggestions({
  criteria, // Object - Criterios activos; criteria.q es el texto inicial del campo
  suggestions, // Array - Textos (String) del catálogo que se ofrecen como sugerencia
}) {
  const [q, setQ] = useState(criteria.q ?? "");
  const [recentSearches, setRecentSearches] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActive] = useState(-1);
  const input = useRef(null);
  const form = useRef(null);
  const options = getSearchOptions(q, suggestions, recentSearches);
  const visible = open && options.length > 0;
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
    function handleOutsideClick(event) {
      if (!form.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);
  // requestSubmit lee el formulario antes del siguiente render de React.
  // Escribimos la sugerencia en el input para enviar el texto elegido, no el anterior.
  function selectSuggestion(text) {
    if (input.current) {
      input.current.value = text;
    }
    saveRecentSearch(text);
    setOpen(false);
    form.current?.requestSubmit();
  }

  function handleSearchChange(event) {
    setQ(event.target.value);
    setActive(-1);
    setOpen(true);
  }
  function handleSearchFocus() {
    setRecentSearches(readRecentSearches());
    setOpen(true);
  }
  function clearSearch() {
    setQ("");
    setActive(-1);
    input.current?.focus();
  }
  function handleSubmit() {
    saveRecentSearch(input.current?.value ?? "");
  }
  function handleSuggestionKeyDown(event) {
    if (["Escape", "Tab"].includes(event.key)) {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(event.key) && options.length) {
      event.preventDefault();
      setOpen(true);
      const nextIndex =
        (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      setActive(nextIndex);
      document.getElementById(`search-option-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter" && visible && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(options[activeIndex].texto);
    }
  }

  return {
    q,
    recentSearches,
    activeIndex,
    input,
    form,
    options,
    visible,
    selectSuggestion,
    handleSearchChange,
    handleSearchFocus,
    handleSuggestionKeyDown,
    clearSearch,
    handleSubmit,
  };
}
