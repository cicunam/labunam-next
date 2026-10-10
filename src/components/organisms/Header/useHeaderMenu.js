"use client";

import { useEffect, useRef, useState } from "react";

/** Mantiene juntos apertura, bloqueo del scroll y retorno del foco del menú. */
export function useHeaderMenu() {
  const [abierto, setOpen] = useState(false);
  const boton = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    if (!abierto) {
      return;
    }
    // Bloqueamos el fondo mientras el menú móvil ocupa la pantalla.
    const anterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const escritorio = window.matchMedia("(min-width: 1128px)");
    function closeMenu() {
      setOpen(false);
      boton.current?.focus();
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
      if (event.key !== "Tab") {
        return;
      }
      // El recorrido de Tab incluye el botón de cierre y los enlaces del panel.
      const enlaces = panel.current?.querySelectorAll("a");
      const ultimo = enlaces?.[enlaces.length - 1];
      if (event.shiftKey && document.activeElement === boton.current) {
        event.preventDefault();
        ultimo?.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        boton.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    escritorio.addEventListener("change", closeMenu);
    return () => {
      document.documentElement.style.overflow = anterior;
      document.removeEventListener("keydown", handleKeyDown);
      escritorio.removeEventListener("change", closeMenu);
    };
  }, [abierto]);

  function toggleMenu() {
    setOpen((previous) => !previous);
  }
  function closeMenu() {
    setOpen(false);
  }
  return { abierto, boton, panel, toggleMenu, closeMenu };
}
