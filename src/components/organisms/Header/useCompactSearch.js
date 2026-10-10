"use client";

import { useEffect, useState } from "react";

/** Muestra el acceso al buscador cuando éste queda fuera de la pantalla. */
export function useCompactSearch(ruta) {
  const [compacto, setCompact] = useState(false);
  useEffect(() => {
    let actual;
    const observer = new IntersectionObserver(([entrada]) => setCompact(!entrada.isIntersecting));
    function observeSearchBar() {
      const elemento = document.querySelector("[data-buscador]");
      if (actual === elemento) {
        return;
      }
      observer.disconnect();
      actual = elemento;
      if (elemento) {
        observer.observe(elemento);
      } else {
        setCompact(false);
      }
    }
    // Next conserva la cabecera al navegar, pero reemplaza el buscador de la página.
    // Volvemos a observarlo cuando cambia el DOM, incluso si llega por streaming.
    const cambios = new MutationObserver(observeSearchBar);
    cambios.observe(document.body, { childList: true, subtree: true });
    observeSearchBar();
    return () => {
      observer.disconnect();
      cambios.disconnect();
    };
  }, [ruta]);

  return compacto;
}
