"use client";

import { useEffect, useRef, useState } from "react";
import {
  saveRecentSearch,
  readRecentSearches,
  getSearchOptions,
} from "@/lib/sugerencias/sugerencias";

/** Gestiona sugerencias, historial local y teclado; no consulta el catálogo. */
export function useSearchSuggestions({ criterios, sugerencias }) {
  const [q, setQ] = useState(criterios.q ?? "");
  const [recientes, setRecentSearches] = useState([]);
  const [abierto, setOpen] = useState(false);
  const [activa, setActive] = useState(-1);
  const input = useRef(null);
  const form = useRef(null);
  const opciones = getSearchOptions(q, sugerencias, recientes);
  const visible = abierto && opciones.length > 0;
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
  function selectSuggestion(texto) {
    if (input.current) {
      input.current.value = texto;
    }
    saveRecentSearch(texto);
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
    if (["ArrowDown", "ArrowUp"].includes(event.key) && opciones.length) {
      event.preventDefault();
      setOpen(true);
      const siguiente =
        (activa + (event.key === "ArrowDown" ? 1 : -1) + opciones.length) % opciones.length;
      setActive(siguiente);
      document.getElementById(`busqueda-opcion-${siguiente}`)?.scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter" && visible && activa >= 0) {
      event.preventDefault();
      selectSuggestion(opciones[activa].texto);
    }
  }

  return {
    q,
    recientes,
    activa,
    input,
    form,
    opciones,
    visible,
    selectSuggestion,
    handleSearchChange,
    handleSearchFocus,
    handleSuggestionKeyDown,
    clearSearch,
    handleSubmit,
  };
}
