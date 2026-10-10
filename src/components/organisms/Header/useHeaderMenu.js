"use client";

// LabUNAM
// Mecanismos
// useHeaderMenu (menú móvil del Header)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useEffect, useRef, useState } from "react";

// Definición del mecanismo
// Mantiene juntos apertura, bloqueo del scroll y retorno del foco del menú.
// No recibe parámetros.
export function useHeaderMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    if (!open) {
      return;
    }
    // Bloqueamos el fondo mientras el menú móvil ocupa la pantalla.
    const previousValue = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1128px)");
    function closeMenu() {
      setOpen(false);
      button.current?.focus();
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
      if (event.key !== "Tab") {
        return;
      }
      // El recorrido de Tab incluye el botón de cierre y los enlaces del panel.
      const links = panel.current?.querySelectorAll("a");
      const last = links?.[links.length - 1];
      if (event.shiftKey && document.activeElement === button.current) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        button.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", closeMenu);
    return () => {
      document.documentElement.style.overflow = previousValue;
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", closeMenu);
    };
  }, [open]);

  function toggleMenu() {
    setOpen((previous) => !previous);
  }
  function closeMenu() {
    setOpen(false);
  }
  return { open, button, panel, toggleMenu, closeMenu };
}
