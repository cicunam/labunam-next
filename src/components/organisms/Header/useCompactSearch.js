"use client";

import { useEffect, useState } from "react";

/** Muestra el acceso al buscador cuando éste queda fuera de la pantalla. */
export function useCompactSearch(pathname) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    let current;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting));
    function observeSearchBar() {
      const element = document.querySelector("[data-search]");
      if (current === element) {
        return;
      }
      observer.disconnect();
      current = element;
      if (element) {
        observer.observe(element);
      } else {
        setCompact(false);
      }
    }
    // Next conserva la cabecera al navegar, pero reemplaza el buscador de la página.
    // Volvemos a observarlo cuando cambia el DOM, incluso si llega por streaming.
    const changes = new MutationObserver(observeSearchBar);
    changes.observe(document.body, { childList: true, subtree: true });
    observeSearchBar();
    return () => {
      observer.disconnect();
      changes.disconnect();
    };
  }, [pathname]);

  return compact;
}
