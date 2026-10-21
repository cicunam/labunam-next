"use client";

// LabUNAM
// Mecanismos
// useAutocomplete (apertura, opción activa y teclado de un combobox con lista de sugerencias)
// Ángelo M

// Dependencias
import { useEffect, useRef, useState } from "react";

// Definición del mecanismo
// Patrón de combobox de la WAI: el foco se queda en el campo y la opción activa se anuncia
// con aria-activedescendant. Flechas para recorrer, Enter para elegir, Escape o Tab para cerrar.
export function useAutocomplete({
  options, // Array - Opciones visibles de la lista
  onSelect, // Function - Recibe la opción elegida
  optionId, // Function - Recibe un índice y devuelve el id de esa opción en el DOM
  inputRef, // Object Optional - Referencia del campo cuando quien usa el combobox también la necesita
}) {
  // Referencias y estado
  const ownInput = useRef(null);
  const input = inputRef ?? ownInput;
  const list = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActive] = useState(-1);
  const visible = open && options.length > 0;

  // Un clic fuera del campo y de la lista la cierra.
  useEffect(() => {
    if (!open) {
      return;
    }
    function handleOutsideClick(event) {
      if (!input.current?.contains(event.target) && !list.current?.contains(event.target)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [open, input]);

  // Gestores de evento
  function show() {
    setOpen(true);
  }

  // Al escribir cambian las opciones: ninguna queda activa hasta usar las flechas.
  function restart() {
    setActive(-1);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setActive(-1);
  }

  function select(
    index, // Number - Posición de la opción elegida
  ) {
    if (options[index]) {
      onSelect(options[index]);
    }
    close();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" || event.key === "Tab") {
      // Con la lista abierta, Escape sólo la cierra (no cierra un diálogo que la contenga).
      if (event.key === "Escape" && visible) {
        event.preventDefault();
      }
      close();
      return;
    }
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (activeIndex + step + options.length) % options.length;
      setActive(nextIndex);
      document.getElementById(optionId(nextIndex))?.scrollIntoView({ block: "nearest" });
      return;
    }
    if (event.key === "Enter" && visible && activeIndex >= 0) {
      event.preventDefault();
      select(activeIndex);
    }
  }

  return { input, list, visible, activeIndex, show, restart, select, handleKeyDown };
}
