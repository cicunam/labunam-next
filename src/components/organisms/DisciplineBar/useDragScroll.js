"use client";

// LabUNAM
// Mecanismos
// useDragScroll (arrastre con el cursor y flechas de una franja horizontal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useEffect, useRef } from "react";

// Definición del mecanismo
// La franja se describe con atributos de datos dentro del contenedor que recibe la referencia:
// data-track es el elemento que se desplaza y data-move="-1" / "1" son las flechas. El toque
// usa el desplazamiento nativo del navegador; aquí se añaden el arrastre con mouse sin activar
// enlaces, las flechas con su ocultamiento en los extremos y el centrado inicial del elemento
// activo (aria-current="page"). No recibe parámetros y devuelve la referencia del contenedor.
export function useDragScroll() {
  const frame = useRef(null);

  // Arrastre con mouse y flechas de la barra horizontal
  useEffect(() => {
    const track = frame.current?.querySelector("[data-track]");
    const arrows = frame.current?.querySelectorAll("[data-move]");
    if (!track || !arrows) {
      return;
    }
    const events = new AbortController();
    let drag = null;
    let suppressClick = false;
    track.addEventListener("dragstart", (event) => event.preventDefault(), {
      signal: events.signal,
    });
    track.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType === "touch" || event.button !== 0 || !event.isPrimary) {
          return;
        }
        suppressClick = false;
        drag = { id: event.pointerId, x: event.clientX, scroll: track.scrollLeft, moved: false };
      },
      { signal: events.signal },
    );
    track.addEventListener(
      "pointermove",
      (event) => {
        if (!drag || event.pointerId !== drag.id) {
          return;
        }
        const delta = event.clientX - drag.x;
        if (!drag.moved && Math.abs(delta) < 6) {
          return;
        }
        drag.moved = true;
        suppressClick = true;
        track.dataset.dragging = "";
        track.setPointerCapture(event.pointerId);
        event.preventDefault();
        track.scrollLeft = drag.scroll - delta;
      },
      { signal: events.signal },
    );
    function finishDrag(event) {
      if (!drag || event.pointerId !== drag.id) {
        return;
      }
      drag = null;
      delete track.dataset.dragging;
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    }
    window.addEventListener("pointerup", finishDrag, { signal: events.signal });
    window.addEventListener("pointercancel", finishDrag, { signal: events.signal });
    track.addEventListener("lostpointercapture", finishDrag, { signal: events.signal });
    // Tras un arrastre, el clic que lo cierra no debe seguir el enlace bajo el cursor.
    track.addEventListener(
      "click",
      (event) => {
        if (!suppressClick) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      },
      { capture: true, signal: events.signal },
    );
    function update() {
      arrows.forEach((arrow) => {
        arrow.hidden =
          arrow.dataset.move === "-1"
            ? track.scrollLeft < 8
            : track.scrollWidth - track.clientWidth - track.scrollLeft < 8;
      });
    }
    arrows.forEach((arrow) =>
      arrow.addEventListener(
        "click",
        () =>
          track.scrollBy({
            left: Number(arrow.dataset.move) * track.clientWidth * 0.8,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          }),
        { signal: events.signal },
      ),
    );
    track.addEventListener("scroll", update, { signal: events.signal, passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(track);
    update();
    const activeItem = track.querySelector('[aria-current="page"]');
    if (activeItem) {
      track.scrollTo({
        left: Math.max(0, activeItem.offsetLeft - track.clientWidth / 2),
        behavior: "instant",
      });
    }
    update();
    return () => {
      events.abort();
      resize.disconnect();
    };
  }, []);

  return frame;
}
