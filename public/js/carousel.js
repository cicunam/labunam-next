// LabUNAM
// Scripts del navegador
// carousel (carrusel infinito de noticias con arrastre y avance automático)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

(() => {
  // Las copias laterales permiten cruzar ambos extremos sin recorrer toda la pista.
  // La marca global evita registrar el script dos veces si Next lo vuelve a cargar.
  if (window.labunamCarrusel) {
    return;
  }
  window.labunamCarrusel = true;

  // Estado
  // Carruseles montados y la función que libera los listeners y observadores de cada uno.
  const mounted = new Map();

  // Definición del módulo
  // Prepara un carrusel: posición inicial, controles, arrastre, avance automático y limpieza.
  function initialize(
    root, // Element - Contenedor [data-carousel] con la pista [data-slides], las diapositivas [data-slide] y los botones [data-page] y [data-step]
  ) {
    // Datos
    const track = root.querySelector("[data-slides]");
    const slides = [...root.querySelectorAll("[data-slide]")];
    const pages = [...root.querySelectorAll("[data-page]")];
    const count = pages.length;
    if (!track || !count) {
      return;
    }

    // Preparación de datos
    // Con varias noticias, la primera original está después de las copias de la izquierda.
    const offset = count > 1 ? count : 0;
    const events = new AbortController();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");

    // Estado
    let index = offset,
      drag = null,
      suppressClick = false,
      timer,
      frame;
    const duration = 7000;
    let elapsed = 0,
      lastTick = performance.now(),
      autoplayFrame,
      hovering = false,
      focused = false,
      visible = false;

    // Utilidades
    // Reinicia el reloj del avance automático y vacía la barra de progreso.
    function resetProgress() {
      elapsed = 0;
      root.style.setProperty("--carousel-progress", "0");
    }
    // Registra un listener que se elimina junto con los demás al desmontar el carrusel.
    const listen = (
      element, // Element | Object - Destino del evento: elemento, window, document o MediaQueryList
      name, // String - Nombre del evento
      handler, // Function - Gestor que recibe el evento
      options = {}, // Object Optional - Opciones de addEventListener; se les añade la señal de limpieza
    ) => element.addEventListener(name, handler, { ...options, signal: events.signal });
    // Calcula el desplazamiento de la pista que centra una diapositiva.
    const position = (
      i, // Number - Índice de la diapositiva en la pista, incluidas las copias laterales
    ) => slides[i].offsetLeft - (track.clientWidth - slides[i].offsetWidth) / 2;
    // Toma como actual la diapositiva más cercana al centro y sincroniza los indicadores.
    function update() {
      const previous = index % count;
      index = slides.reduce(
        (best, _, i) =>
          Math.abs(position(i) - track.scrollLeft) < Math.abs(position(best) - track.scrollLeft)
            ? i
            : best,
        0,
      );
      if (previous !== index % count) {
        resetProgress();
      }
      slides.forEach((slide, i) => slide.toggleAttribute("data-active", i === index));
      pages.forEach((page, i) => page.setAttribute("aria-pressed", String(i === index % count)));
    }
    // Centra una diapositiva sin animación; data-resetting desactiva el snap durante el salto.
    function jump(
      i, // Number - Índice de la diapositiva en la pista, incluidas las copias laterales
    ) {
      cancelAnimationFrame(frame);
      track.dataset.resetting = "";
      track.scrollTo({ left: position(i), behavior: "instant" });
      update();
      frame = requestAnimationFrame(() => {
        delete track.dataset.resetting;
      });
    }
    // Al acabar el desplazamiento, volvemos de una copia lateral a su original idéntico.
    // El salto es instantáneo y mantiene la ilusión de un carrusel infinito.
    function settle() {
      if (drag || track.hasAttribute("data-resetting")) {
        return;
      }
      update();
      if (count > 1 && (index < count || index >= count * 2)) {
        jump(count + (index % count));
      }
    }
    // Desplaza la pista hasta una diapositiva, sin animar si se pidió movimiento reducido.
    function show(
      i, // Number - Índice deseado en la pista; se limita a las diapositivas existentes
    ) {
      resetProgress();
      const target = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: position(target), behavior: motion.matches ? "instant" : "smooth" });
    }

    // Gestores de evento
    root.querySelectorAll("[data-step]").forEach((button) => {
      button.disabled = count < 2;
      listen(button, "click", () => {
        settle();
        show(index + Number(button.dataset.step));
      });
    });
    pages.forEach((button, i) => listen(button, "click", () => show(offset + i)));
    listen(track, "scroll", () => {
      update();
      clearTimeout(timer);
      timer = setTimeout(settle, 140);
    });
    listen(track, "scrollend", settle);
    listen(track, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) {
        return;
      }
      event.preventDefault();
      settle();
      show(index + (event.key === "ArrowRight" ? 1 : -1));
    });
    listen(track, "dragstart", (event) => event.preventDefault());
    listen(track, "pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0 || count < 2) {
        return;
      }
      suppressClick = false;
      settle();
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        scroll: track.scrollLeft,
        index,
        moved: false,
      };
    });
    listen(
      track,
      "pointermove",
      (event) => {
        if (!drag || event.pointerId !== drag.id) {
          return;
        }
        const dx = event.clientX - drag.x,
          dy = event.clientY - drag.y;
        // Una intención vertical conserva el scroll normal de la página en pantallas táctiles.
        // El umbral evita convertir un clic pequeño en un arrastre y bloquear su enlace.
        if (!drag.moved) {
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
            drag = null;
            return;
          }
          if (Math.abs(dx) < 8) {
            return;
          }
          drag.moved = true;
          suppressClick = true;
          track.dataset.dragging = "";
          track.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        track.scrollLeft = drag.scroll - dx;
      },
      { passive: false },
    );
    // Termina el arrastre: avanza o retrocede si superó el umbral y, si no, vuelve a la diapositiva inicial.
    function finish(
      event, // Object - PointerEvent de pointerup, pointercancel o lostpointercapture; se usan pointerId y type
    ) {
      if (!drag || event.pointerId !== drag.id) {
        return;
      }
      const previous = drag;
      const delta = previous.scroll - track.scrollLeft;
      drag = null;
      delete track.dataset.dragging;
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      if (previous.moved) {
        show(
          event.type !== "pointercancel" && Math.abs(delta) > 40
            ? previous.index + (delta < 0 ? 1 : -1)
            : previous.index,
        );
      }
    }
    listen(window, "pointerup", finish);
    listen(window, "pointercancel", finish);
    listen(track, "lostpointercapture", (event) => {
      if (event.target === track) {
        finish(event);
      }
    });
    listen(
      track,
      "click",
      (event) => {
        if (suppressClick) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        }
      },
      { capture: true },
    );
    listen(root, "mouseenter", () => {
      hovering = true;
    });
    listen(root, "mouseleave", () => {
      hovering = false;
    });
    listen(root, "focusin", () => {
      focused = true;
    });
    listen(root, "focusout", (event) => {
      focused = root.contains(event.relatedTarget);
    });
    listen(document, "visibilitychange", () => {
      lastTick = performance.now();
    });
    listen(motion, "change", resetProgress);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastTick = performance.now();
    });
    visibility.observe(root);
    // La barra y el avance comparten reloj; las pausas conservan el tiempo restante.
    function tick(
      now, // Number - Marca de tiempo en milisegundos que entrega requestAnimationFrame
    ) {
      const delta = now - lastTick;
      lastTick = now;
      // Sólo avanza el reloj si la noticia está centrada y el usuario no está interactuando.
      // Movimiento reducido desactiva tanto el avance como el progreso automático.
      const centered = Math.abs(position(index) - track.scrollLeft) < 2;
      if (
        count > 1 &&
        visible &&
        !document.hidden &&
        !hovering &&
        !focused &&
        !drag &&
        !motion.matches &&
        centered
      ) {
        elapsed = Math.min(duration, elapsed + delta);
        root.style.setProperty("--carousel-progress", String(elapsed / duration));
        if (elapsed >= duration) {
          settle();
          show(index + 1);
        }
      }
      autoplayFrame = requestAnimationFrame(tick);
    }

    // Ejecución
    root.dataset.ready = "";
    jump(offset);
    autoplayFrame = requestAnimationFrame(tick);
    const resize = new ResizeObserver(() => {
      if (!drag) {
        jump(offset + (index % count));
      }
    });
    resize.observe(track);
    mounted.set(root, () => {
      events.abort();
      resize.disconnect();
      visibility.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(autoplayFrame);
    });
  }

  // Utilidades
  // Next puede reemplazar secciones sin recargar la página: desmontamos sus listeners
  // y observadores antes de inicializar los nuevos carruseles.
  function refresh() {
    mounted.forEach((cleanup, root) => {
      if (!root.isConnected) {
        cleanup();
        mounted.delete(root);
      }
    });
    document.querySelectorAll("[data-carousel]").forEach((root) => {
      if (!mounted.has(root)) {
        initialize(root);
      }
    });
  }

  // Ejecución
  new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
  refresh();
})();
