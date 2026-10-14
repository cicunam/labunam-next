"use client";

// LabUNAM
// Mecanismos
// useLaboratoryDialog (apertura, carga e historial de la ficha en modal)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useEffect, useRef, useState } from "react";

// Definición del mecanismo
// Contrato con el resto del portal: cualquier elemento con data-details="<id>" abre la ficha
// de ese laboratorio. Las tarjetas no importan el diálogo ni llaman funciones suyas; basta
// con el atributo. Así el catálogo sigue siendo HTML de servidor con un solo diálogo por página.
export function useLaboratoryDialog({
  loadDetails, // Function - Recibe el id (Number) y devuelve una promesa con la ficha pública
  initialLaboratorio, // Object | null - Ficha ya cargada por la página; con ella no se escucha ningún clic
}) {
  // Referencias y estado
  const dialog = useRef(null);
  const trigger = useRef(null);
  const cache = useRef(new Map());
  const request = useRef(0);
  const hasHistoryEntry = useRef(false);
  const [lab, setLab] = useState(initialLaboratorio);
  const [error, setError] = useState("");

  // Apertura, carga e historial del modal
  useEffect(() => {
    if (initialLaboratorio) {
      return;
    }
    let current = true;
    async function show(id) {
      // Si se abre otra ficha antes de terminar esta petición, ignoramos su respuesta.
      // El contador también invalida resultados al cerrar el diálogo.
      const requestId = ++request.current;
      setLab(null);
      setError("");
      dialog.current?.showModal();
      // Guardamos promesas para compartir cargas. Un fallo se elimina para permitir reintentos.
      if (!cache.current.has(id)) {
        cache.current.set(
          id,
          loadDetails(id).catch((error) => {
            cache.current.delete(id);
            throw error;
          }),
        );
      }
      try {
        const data = await cache.current.get(id);
        if (current && requestId === request.current) {
          setLab(data);
        }
      } catch {
        if (current && requestId === request.current) {
          setError("No se pudo cargar la ficha. Ciérrala y vuelve a intentarlo.");
        }
      }
    }
    function open(event) {
      const button = event.target.closest("[data-details]");
      const id = Number(button?.dataset.details);
      if (!button || !Number.isSafeInteger(id) || id <= 0) {
        return;
      }
      trigger.current = button;
      // Cambiamos la URL sin desmontar el catálogo: conserva filtros y scroll.
      // Una recarga completa de esta URL sí renderiza la página de la ficha.
      window.history.pushState({ fichaLabunam: id }, "", `/laboratorios/${id}`);
      hasHistoryEntry.current = true;
      void show(id);
    }
    // Atrás cierra el modal; Adelante recupera la ficha usando la marca del historial.
    function syncHistory() {
      const id = window.history.state?.fichaLabunam;
      hasHistoryEntry.current = Number.isSafeInteger(id) && id > 0;
      if (hasHistoryEntry.current) {
        void show(id);
      } else {
        request.current++;
        dialog.current?.close();
      }
    }
    document.addEventListener("click", open);
    window.addEventListener("popstate", syncHistory);
    syncHistory();
    return () => {
      current = false;
      document.removeEventListener("click", open);
      window.removeEventListener("popstate", syncHistory);
    };
  }, [loadDetails, initialLaboratorio]);

  // Gestores de evento
  function closeDialog() {
    dialog.current?.close();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  function handleClose() {
    request.current++;
    // Sólo deshacemos la entrada que creó el modal; evita retroceder dos veces con Atrás.
    if (hasHistoryEntry.current) {
      hasHistoryEntry.current = false;
      window.history.back();
    }
    trigger.current?.focus({ preventScroll: true });
  }

  return { lab, error, dialog, closeDialog, handleBackdropClick, handleClose };
}
