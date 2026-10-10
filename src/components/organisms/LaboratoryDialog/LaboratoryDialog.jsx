"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { fetchLaboratorioDetails } from "@/lib/ficha/ficha";
import { Icon } from "../../atoms/Icon/Icon";
import styles from "./LaboratoryDialog.module.css";

const LaboratoryDetails = lazy(() =>
  import("../LaboratoryDetails/LaboratoryDetails").then((modulo) => ({
    default: modulo.LaboratoryDetails,
  })),
);
export function LaboratoryDialog({ loadDetails = fetchLaboratorioDetails, inicial = null }) {
  const dialogo = useRef(null);
  const disparador = useRef(null);
  const memoria = useRef(new Map());
  const peticion = useRef(0);
  const enHistorial = useRef(false);
  const [lab, setLab] = useState(inicial);
  const [error, setError] = useState("");
  useEffect(() => {
    if (inicial) {
      return;
    }
    let vigente = true;
    async function show(id) {
      // Si se abre otra ficha antes de terminar esta petición, ignoramos su respuesta.
      // El contador también invalida resultados al cerrar el diálogo.
      const turno = ++peticion.current;
      setLab(null);
      setError("");
      dialogo.current?.showModal();
      // Guardamos promesas para compartir cargas. Un fallo se elimina para permitir reintentos.
      if (!memoria.current.has(id)) {
        memoria.current.set(
          id,
          loadDetails(id).catch((error) => {
            memoria.current.delete(id);
            throw error;
          }),
        );
      }
      try {
        const datos = await memoria.current.get(id);
        if (vigente && turno === peticion.current) {
          setLab(datos);
        }
      } catch {
        if (vigente && turno === peticion.current) {
          setError("No se pudo cargar la ficha. Ciérrala y vuelve a intentarlo.");
        }
      }
    }
    function open(event) {
      const boton = event.target.closest("[data-ficha]");
      const id = Number(boton?.dataset.ficha);
      if (!boton || !Number.isSafeInteger(id) || id <= 0) {
        return;
      }
      disparador.current = boton;
      // Cambiamos la URL sin desmontar el catálogo: conserva filtros y scroll.
      // Una recarga completa de esta URL sí renderiza la página de la ficha.
      window.history.pushState({ fichaLabunam: id }, "", `/laboratorios/${id}`);
      enHistorial.current = true;
      void show(id);
    }
    // Atrás cierra el modal; Adelante recupera la ficha usando la marca del historial.
    function syncHistory() {
      const id = window.history.state?.fichaLabunam;
      enHistorial.current = Number.isSafeInteger(id) && id > 0;
      if (enHistorial.current) {
        void show(id);
      } else {
        peticion.current++;
        dialogo.current?.close();
      }
    }
    document.addEventListener("click", open);
    window.addEventListener("popstate", syncHistory);
    syncHistory();
    return () => {
      vigente = false;
      document.removeEventListener("click", open);
      window.removeEventListener("popstate", syncHistory);
    };
  }, [loadDetails, inicial]);
  function closeDialog() {
    dialogo.current?.close();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  function handleClose() {
    peticion.current++;
    // Sólo deshacemos la entrada que creó el modal; evita retroceder dos veces con Atrás.
    if (enHistorial.current) {
      enHistorial.current = false;
      window.history.back();
    }
    disparador.current?.focus({ preventScroll: true });
  }

  const ficha = (
    <>
      {!lab ? (
        <div className={styles.estado}>
          <h2 id="ficha-titulo">Ficha del laboratorio</h2>
          <p role={error ? "alert" : "status"}>{error || "Cargando…"}</p>
        </div>
      ) : (
        <>
          <Suspense
            fallback={
              <p
                id="ficha-titulo"
                role="status"
              >
                Cargando ficha…
              </p>
            }
          >
            <LaboratoryDetails
              key={lab.idLab}
              laboratorio={lab}
              pagina={Boolean(inicial)}
            />
          </Suspense>
        </>
      )}
    </>
  );
  if (inicial) {
    return (
      <article
        className={styles.pagina}
        aria-labelledby="ficha-titulo"
      >
        {ficha}
      </article>
    );
  }
  return (
    <dialog
      ref={dialogo}
      className={styles.ficha}
      aria-labelledby="ficha-titulo"
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        className={styles["ficha-cerrar"]}
        aria-label="Cerrar ficha"
        onClick={closeDialog}
      >
        <Icon
          nombre="cerrar"
          tamano={16}
        />
      </button>
      {ficha}
    </dialog>
  );
}
