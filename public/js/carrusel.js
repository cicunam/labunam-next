(() => {
  // Cada montaje se libera al salir de la página, también con navegación de Next.
  if (window.labunamCarrusel) return;
  window.labunamCarrusel = true;
  const montados = new Map();
  function initialize(raiz) {
    const pista = raiz.querySelector("[data-slides]");
    const slides = [...raiz.querySelectorAll("[data-slide]")];
    const paginas = [...raiz.querySelectorAll("[data-pagina]")];
    const pausa = raiz.querySelector("[data-pausa]");
    const eventos = new AbortController();
    const movimiento = matchMedia("(prefers-reduced-motion: reduce)");
    let indice = 0, detenido = movimiento.matches, hover = false, foco = false, inicio = null;
    function show(n) {
      indice = (n + slides.length) % slides.length;
      const rect = slides[indice].getBoundingClientRect();
      const base = pista.getBoundingClientRect();
      pista.scrollTo({ left: pista.scrollLeft + rect.left - base.left - (base.width - rect.width) / 2, behavior: movimiento.matches ? "instant" : "smooth" });
    }
    function update() {
      const centro = pista.getBoundingClientRect().left + pista.clientWidth / 2;
      indice = slides.reduce((mejor, slide, i) => Math.abs(slide.getBoundingClientRect().left + slide.clientWidth / 2 - centro) < Math.abs(slides[mejor].getBoundingClientRect().left + slides[mejor].clientWidth / 2 - centro) ? i : mejor, 0);
      slides.forEach((slide, i) => slide.toggleAttribute("data-activo", i === indice));
      paginas.forEach((boton, i) => boton.setAttribute("aria-pressed", String(i === indice)));
    }
    function updatePauseState() { pausa.textContent = detenido ? "Reanudar" : "Pausar"; pausa.setAttribute("aria-label", `${detenido ? "Reanudar" : "Pausar"} noticias`); }
    const listen = (elemento, nombre, funcion) => elemento.addEventListener(nombre, funcion, { signal: eventos.signal });
    raiz.querySelectorAll("[data-paso]").forEach((boton) => listen(boton, "click", () => show(indice + Number(boton.dataset.paso))));
    paginas.forEach((boton, i) => listen(boton, "click", () => show(i)));
    listen(pausa, "click", () => { detenido = !detenido; updatePauseState(); });
    listen(raiz, "mouseenter", () => { hover = true; });
    listen(raiz, "mouseleave", () => { hover = false; });
    listen(raiz, "focusin", () => { foco = true; });
    listen(raiz, "focusout", (event) => { foco = raiz.contains(event.relatedTarget); });
    listen(pista, "scroll", update);
    listen(pista, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault(); show(indice + (event.key === "ArrowRight" ? 1 : -1));
    });
    listen(pista, "pointerdown", (event) => { if (event.pointerType === "mouse") inicio = { x: event.clientX, scroll: pista.scrollLeft }; });
    listen(window, "pointermove", (event) => { if (inicio) pista.scrollLeft = inicio.scroll - event.clientX + inicio.x; });
    listen(pista, "click", (event) => { if (inicio && Math.abs(event.clientX - inicio.x) > 8) event.preventDefault(); });
    listen(window, "pointerup", () => { setTimeout(() => { inicio = null; }, 0); });
    listen(movimiento, "change", () => { if (movimiento.matches) { detenido = true; updatePauseState(); } });
    const intervalo = setInterval(() => { if (!detenido && !hover && !foco && !document.hidden && !inicio) show(indice + 1); }, 7000);
    raiz.dataset.listo = ""; updatePauseState();
    montados.set(raiz, () => { eventos.abort(); clearInterval(intervalo); });
  }
  function refresh() {
    montados.forEach((limpiar, raiz) => { if (!raiz.isConnected) { limpiar(); montados.delete(raiz); } });
    document.querySelectorAll("[data-carrusel]").forEach((raiz) => { if (!montados.has(raiz)) initialize(raiz); });
  }
  new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
  refresh();
})();
