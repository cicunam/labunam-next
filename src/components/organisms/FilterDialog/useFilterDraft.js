"use client";

// LabUNAM
// Mecanismos
// useFilterDraft (selección borrador de filtros con conteos en vivo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useEffect, useRef, useState } from "react";
import { fetchFilterCounts } from "@/lib/api/api";

// Definición del mecanismo
// La selección es un borrador: cada cambio pide a /api/filtros los conteos que resultarían,
// pero la URL del catálogo no cambia hasta que el formulario se envía.
export function useFilterDraft({
  criteria, // Object - Criterios aplicados en la URL; son el punto de partida del borrador
  filters, // Array - Facetas calculadas en el servidor para los criterios aplicados
  total, // Number - Laboratorios que coinciden con los criterios aplicados
}) {
  // Referencias y estado
  const request = useRef(null);
  const [selection, setSelection] = useState(criteria);
  const [data, setData] = useState({ filters, total });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // Al desmontar se cancela la consulta en curso para no actualizar un estado que ya no existe.
  useEffect(() => {
    return () => {
      request.current?.abort();
    };
  }, []);

  // Gestores de evento
  async function updateSelection(nextSelection) {
    setSelection(nextSelection);
    setPending(true);
    setError("");
    // Una elección nueva cancela la consulta anterior para no mostrar conteos atrasados.
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      setData(await fetchFilterCounts(nextSelection, controller.signal));
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

  return { selection, data, pending, error, updateSelection };
}
