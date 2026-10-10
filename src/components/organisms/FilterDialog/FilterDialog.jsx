"use client";

import { useEffect, useRef, useState } from "react";
import { FilterOption } from "../../molecules/FilterOption/FilterOption";
import { Icon } from "../../atoms/Icon/Icon";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";
import styles from "./FilterDialog.module.css";

export function FilterDialog({ criterios, filtros, total, children }) {
  const dialogo = useRef(null);
  const barra = useRef(null);
  const peticion = useRef(null);
  // La selección es un borrador: consultar conteos no cambia la URL hasta aplicar los filtros.
  const [seleccion, setSelection] = useState(criterios);
  const [datos, setData] = useState({ filtros, total });
  const [pendiente, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const pista = barra.current?.querySelector("[data-pista]");
    const flechas = barra.current?.querySelectorAll("[data-mover]");
    if (!pista || !flechas) {
      return;
    }
    const eventos = new AbortController();
    let drag = null;
    let suppressClick = false;
    pista.addEventListener("dragstart", (event) => event.preventDefault(), {
      signal: eventos.signal,
    });
    pista.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType === "touch" || event.button !== 0 || !event.isPrimary) {
          return;
        }
        suppressClick = false;
        drag = { id: event.pointerId, x: event.clientX, scroll: pista.scrollLeft, moved: false };
      },
      { signal: eventos.signal },
    );
    pista.addEventListener(
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
        pista.dataset.dragging = "";
        pista.setPointerCapture(event.pointerId);
        event.preventDefault();
        pista.scrollLeft = drag.scroll - delta;
      },
      { signal: eventos.signal },
    );
    function finishDrag(event) {
      if (!drag || event.pointerId !== drag.id) {
        return;
      }
      drag = null;
      delete pista.dataset.dragging;
      if (pista.hasPointerCapture(event.pointerId)) {
        pista.releasePointerCapture(event.pointerId);
      }
    }
    window.addEventListener("pointerup", finishDrag, { signal: eventos.signal });
    window.addEventListener("pointercancel", finishDrag, { signal: eventos.signal });
    pista.addEventListener("lostpointercapture", finishDrag, { signal: eventos.signal });
    pista.addEventListener(
      "click",
      (event) => {
        if (!suppressClick) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      },
      { capture: true, signal: eventos.signal },
    );
    function update() {
      flechas?.forEach((flecha) => {
        flecha.hidden =
          flecha.dataset.mover === "-1"
            ? pista.scrollLeft < 8
            : pista.scrollWidth - pista.clientWidth - pista.scrollLeft < 8;
      });
    }
    flechas.forEach((flecha) =>
      flecha.addEventListener(
        "click",
        () =>
          pista.scrollBy({
            left: Number(flecha.dataset.mover) * pista.clientWidth * 0.8,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          }),
        { signal: eventos.signal },
      ),
    );
    pista.addEventListener("scroll", update, { signal: eventos.signal, passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(pista);
    update();
    const activo = pista.querySelector('[aria-current="page"]');
    if (activo) {
      pista.scrollTo({
        left: Math.max(0, activo.offsetLeft - pista.clientWidth / 2),
        behavior: "instant",
      });
    }
    update();
    return () => {
      eventos.abort();
      resize.disconnect();
      peticion.current?.abort();
    };
  }, []);
  async function updateSelection(nueva) {
    setSelection(nueva);
    setPending(true);
    setError("");
    // Una elección nueva cancela la consulta anterior para no mostrar conteos atrasados.
    peticion.current?.abort();
    const control = new AbortController();
    peticion.current = control;
    try {
      const respuesta = await fetch(getCatalogUrl(nueva).replace("/laboratorios", "/api/filtros"), {
        signal: control.signal,
      });
      if (!respuesta.ok) {
        throw new Error();
      }
      setData(await respuesta.json());
    } catch {
      if (!control.signal.aborted) {
        setError("No se pudieron actualizar los conteos. Puedes aplicar los filtros.");
      }
    } finally {
      if (!control.signal.aborted) {
        setPending(false);
      }
    }
  }
  return (
    <div
      ref={barra}
      className={styles.tira}
    >
      {children}
      <button
        type="button"
        className={styles["tira-filtros"]}
        aria-label="Filtros"
        aria-haspopup="dialog"
        onClick={() => dialogo.current?.showModal()}
      >
        <Icon
          nombre="todas"
          tamano={16}
        />
        Filtros
        {Object.values(criterios).filter(Boolean).length > 0 && (
          <span className={styles["tira-filtros-cuenta"]}>
            {Object.values(criterios).filter(Boolean).length}
          </span>
        )}
      </button>
      <dialog
        ref={dialogo}
        className={styles.modal}
        aria-labelledby="filtros-titulo"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogo.current?.close();
          }
        }}
      >
        <header className={styles["modal-cabeza"]}>
          <button
            type="button"
            className={styles["modal-cerrar"]}
            aria-label="Cerrar filtros"
            onClick={() => dialogo.current?.close()}
          >
            <Icon
              nombre="cerrar"
              tamano={16}
            />
          </button>
          <h2
            id="filtros-titulo"
            className={styles["modal-titulo"]}
          >
            Filtros
          </h2>
        </header>
        <form
          method="get"
          action="/laboratorios"
          className={styles.formulario}
        >
          {["q", "tipo"].map((eje) => (
            <input
              key={eje}
              type="hidden"
              name={eje}
              value={seleccion[eje] ?? ""}
            />
          ))}
          <div className={styles["modal-cuerpo"]}>
            {datos.filtros.map((filtro) => (
              <fieldset
                key={filtro.eje}
                className={styles["modal-grupo"]}
              >
                <legend className={styles["modal-grupo-titulo"]}>{filtro.etiqueta}</legend>
                <div className={styles["modal-opciones"]}>
                  <FilterOption
                    nombre={filtro.eje}
                    valor=""
                    etiqueta="Cualquiera"
                    seleccionada={!seleccion[filtro.eje]}
                    onChange={() => updateSelection({ ...seleccion, [filtro.eje]: "" })}
                  />
                  {filtro.opciones.map((opcion) => (
                    <FilterOption
                      key={opcion.clave}
                      nombre={filtro.eje}
                      valor={opcion.clave}
                      etiqueta={opcion.etiqueta}
                      total={opcion.total}
                      seleccionada={seleccion[filtro.eje] === opcion.clave}
                      onChange={() => updateSelection({ ...seleccion, [filtro.eje]: opcion.clave })}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
            {error && <p role="alert">{error}</p>}
          </div>
          <footer className={styles["modal-pie"]}>
            <button
              type="button"
              className={styles["modal-limpiar"]}
              onClick={() => updateSelection({})}
            >
              Limpiar todo
            </button>
            <button
              type="submit"
              className={styles["modal-aplicar"]}
              disabled={pendiente}
            >
              {pendiente
                ? "Actualizando…"
                : `Ver ${datos.total} ${datos.total === 1 ? "laboratorio" : "laboratorios"}`}
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}
