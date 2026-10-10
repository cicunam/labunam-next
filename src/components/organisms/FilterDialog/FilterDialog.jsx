"use client";

import { useEffect, useRef, useState } from "react";
import FilterOption from "../../molecules/FilterOption/FilterOption";
import Icon from "../../atoms/Icon/Icon";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";
import styles from "./FilterDialog.module.css";

const FilterDialog = ({ criteria, filters, total, children }) => {
  const dialog = useRef(null);
  const bar = useRef(null);
  const request = useRef(null);
  // La selección es un borrador: consultar conteos no cambia la URL hasta aplicar los filtros.
  const [selection, setSelection] = useState(criteria);
  const [data, setData] = useState({ filtros: filters, total });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const track = bar.current?.querySelector("[data-track]");
    const arrows = bar.current?.querySelectorAll("[data-move]");
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
      arrows?.forEach((arrow) => {
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
      request.current?.abort();
    };
  }, []);
  async function updateSelection(nextSelection) {
    setSelection(nextSelection);
    setPending(true);
    setError("");
    // Una elección nueva cancela la consulta anterior para no mostrar conteos atrasados.
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch(
        getCatalogUrl(nextSelection).replace("/laboratorios", "/api/filtros"),
        {
          signal: controller.signal,
        },
      );
      if (!response.ok) {
        throw new Error();
      }
      setData(await response.json());
    } catch {
      if (!controller.signal.aborted) {
        setError("No se pudieron actualizar los conteos. Puedes aplicar los filtros.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setPending(false);
      }
    }
  }
  return (
    <div
      ref={bar}
      className={styles.strip}
    >
      {children}
      <button
        type="button"
        className={styles["strip-filters"]}
        aria-label="Filtros"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <Icon
          name="all"
          size={16}
        />
        Filtros
        {Object.values(criteria).filter(Boolean).length > 0 && (
          <span className={styles["strip-filters-count"]}>
            {Object.values(criteria).filter(Boolean).length}
          </span>
        )}
      </button>
      <dialog
        ref={dialog}
        className={styles.modal}
        aria-labelledby="filters-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialog.current?.close();
          }
        }}
      >
        <header className={styles["modal-header"]}>
          <button
            type="button"
            className={styles["modal-close"]}
            aria-label="Cerrar filtros"
            onClick={() => dialog.current?.close()}
          >
            <Icon
              name="close"
              size={16}
            />
          </button>
          <h2
            id="filters-title"
            className={styles["modal-title"]}
          >
            Filtros
          </h2>
        </header>
        <form
          method="get"
          action="/laboratorios"
          className={styles.form}
        >
          {["q", "tipo"].map((eje) => (
            <input
              key={eje}
              type="hidden"
              name={eje}
              value={selection[eje] ?? ""}
            />
          ))}
          <div className={styles["modal-body"]}>
            {data.filtros.map((filtro) => (
              <fieldset
                key={filtro.eje}
                className={styles["modal-group"]}
              >
                <legend className={styles["modal-group-title"]}>{filtro.etiqueta}</legend>
                <div className={styles["modal-options"]}>
                  <FilterOption
                    name={filtro.eje}
                    value=""
                    label="Cualquiera"
                    selected={!selection[filtro.eje]}
                    onChange={() => updateSelection({ ...selection, [filtro.eje]: "" })}
                  />

                  {filtro.opciones.map((option) => (
                    <FilterOption
                      key={option.clave}
                      name={filtro.eje}
                      value={option.clave}
                      label={option.etiqueta}
                      total={option.total}
                      selected={selection[filtro.eje] === option.clave}
                      onChange={() => updateSelection({ ...selection, [filtro.eje]: option.clave })}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
            {error && <p role="alert">{error}</p>}
          </div>
          <footer className={styles["modal-footer"]}>
            <button
              type="button"
              className={styles["modal-clear"]}
              onClick={() => updateSelection({})}
            >
              Limpiar todo
            </button>
            <button
              type="submit"
              className={styles["modal-apply"]}
              disabled={pending}
            >
              {pending
                ? "Actualizando…"
                : `Ver ${data.total} ${data.total === 1 ? "laboratorio" : "laboratorios"}`}
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
};

export default FilterDialog;
