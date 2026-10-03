(() => {
  // Cada montaje se libera al salir de la página, también con navegación de Next.
  if (window.labunamCarrusel) return;
  window.labunamCarrusel = true;
  const montados = new Map();
  function iniciar(raiz) {
    const pista = raiz.querySelector("[data-slides]");
    const slides = [...raiz.querySelectorAll("[data-slide]")];
    const paginas = [...raiz.querySelectorAll("[data-pagina]")];
    const pausa = raiz.querySelector("[data-pausa]");
    const eventos = new AbortController();
    const movimiento = matchMedia("(prefers-reduced-motion: reduce)");
    let indice = 0, detenido = movimiento.matches, hover = false, foco = false, inicio = null;
    function mostrar(n) {
      indice = (n + slides.length) % slides.length;
      const rect = slides[indice].getBoundingClientRect();
      const base = pista.getBoundingClientRect();
      pista.scrollTo({ left: pista.scrollLeft + rect.left - base.left - (base.width - rect.width) / 2, behavior: movimiento.matches ? "instant" : "smooth" });
    }
    function actualizar() {
      const centro = pista.getBoundingClientRect().left + pista.clientWidth / 2;
      indice = slides.reduce((mejor, slide, i) => Math.abs(slide.getBoundingClientRect().left + slide.clientWidth / 2 - centro) < Math.abs(slides[mejor].getBoundingClientRect().left + slides[mejor].clientWidth / 2 - centro) ? i : mejor, 0);
      slides.forEach((slide, i) => slide.toggleAttribute("data-activo", i === indice));
      paginas.forEach((boton, i) => boton.setAttribute("aria-pressed", String(i === indice)));
    }
    function marcarPausa() { pausa.textContent = detenido ? "Reanudar" : "Pausar"; pausa.setAttribute("aria-label", `${detenido ? "Reanudar" : "Pausar"} noticias`); }
    const escuchar = (elemento, nombre, funcion) => elemento.addEventListener(nombre, funcion, { signal: eventos.signal });
    raiz.querySelectorAll("[data-paso]").forEach((boton) => escuchar(boton, "click", () => mostrar(indice + Number(boton.dataset.paso))));
    paginas.forEach((boton, i) => escuchar(boton, "click", () => mostrar(i)));
    escuchar(pausa, "click", () => { detenido = !detenido; marcarPausa(); });
    escuchar(raiz, "mouseenter", () => { hover = true; });
    escuchar(raiz, "mouseleave", () => { hover = false; });
    escuchar(raiz, "focusin", () => { foco = true; });
    escuchar(raiz, "focusout", (event) => { foco = raiz.contains(event.relatedTarget); });
    escuchar(pista, "scroll", actualizar);
    escuchar(pista, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault(); mostrar(indice + (event.key === "ArrowRight" ? 1 : -1));
    });
    escuchar(pista, "pointerdown", (event) => { if (event.pointerType === "mouse") inicio = { x: event.clientX, scroll: pista.scrollLeft }; });
    escuchar(window, "pointermove", (event) => { if (inicio) pista.scrollLeft = inicio.scroll - event.clientX + inicio.x; });
    escuchar(pista, "click", (event) => { if (inicio && Math.abs(event.clientX - inicio.x) > 8) event.preventDefault(); });
    escuchar(window, "pointerup", () => { setTimeout(() => { inicio = null; }, 0); });
    escuchar(movimiento, "change", () => { if (movimiento.matches) { detenido = true; marcarPausa(); } });
    const intervalo = setInterval(() => { if (!detenido && !hover && !foco && !document.hidden && !inicio) mostrar(indice + 1); }, 7000);
    raiz.dataset.listo = ""; marcarPausa();
    montados.set(raiz, () => { eventos.abort(); clearInterval(intervalo); });
  }
  function revisar() {
    montados.forEach((limpiar, raiz) => { if (!raiz.isConnected) { limpiar(); montados.delete(raiz); } });
    document.querySelectorAll("[data-carrusel]").forEach((raiz) => { if (!montados.has(raiz)) iniciar(raiz); });
  }
  new MutationObserver(revisar).observe(document.body, { childList: true, subtree: true });
  revisar();
})();
