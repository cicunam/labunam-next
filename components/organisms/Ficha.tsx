"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { pedirFicha, type DatosFicha } from "@/lib/ficha";
import { Icono } from "../atoms/Icono";
import styles from "./Ficha.module.css";

const DetalleFicha = lazy(() => import("./DetalleFicha").then((modulo) => ({ default: modulo.DetalleFicha })));
export function Ficha({ cargar = pedirFicha, inicial = null }: { cargar?: (id: number) => Promise<DatosFicha>; inicial?: DatosFicha | null }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const disparador = useRef<HTMLElement | null>(null);
  const memoria = useRef(new Map<number, Promise<DatosFicha>>());
  const peticion = useRef(0);
  const enHistorial = useRef(false);
  const [lab, setLab] = useState<DatosFicha | null>(inicial);
  const [error, setError] = useState("");
  useEffect(() => {
    if (inicial) return;
    let vigente = true;
    async function mostrar(id: number) {
      const turno = ++peticion.current;
      setLab(null); setError("");
      dialogo.current?.showModal();
      if (!memoria.current.has(id)) memoria.current.set(id, cargar(id).catch((error) => { memoria.current.delete(id); throw error; }));
      try {
        const datos = await memoria.current.get(id)!;
        if (vigente && turno === peticion.current) setLab(datos);
      } catch { if (vigente && turno === peticion.current) setError("No se pudo cargar la ficha. Ciérrala y vuelve a intentarlo."); }
    }
    function abrir(event: MouseEvent) {
      const boton = (event.target as HTMLElement).closest<HTMLElement>("[data-ficha]");
      const id = Number(boton?.dataset.ficha);
      if (!boton || !Number.isSafeInteger(id) || id <= 0) return;
      disparador.current = boton;
      window.history.pushState({ fichaLabunam: id }, "", `/laboratorios/${id}`);
      enHistorial.current = true;
      void mostrar(id);
    }
    function sincronizar() {
      const id = window.history.state?.fichaLabunam;
      enHistorial.current = Number.isSafeInteger(id) && id > 0;
      if (enHistorial.current) void mostrar(id);
      else { peticion.current++; dialogo.current?.close(); }
    }
    document.addEventListener("click", abrir);
    window.addEventListener("popstate", sincronizar);
    sincronizar();
    return () => { vigente = false; document.removeEventListener("click", abrir); window.removeEventListener("popstate", sincronizar); };
  }, [cargar, inicial]);
  const ficha = <>
      {!lab ? <div className={styles.estado}><h2 id="ficha-titulo">Ficha del laboratorio</h2><p role={error ? "alert" : "status"}>{error || "Cargando…"}</p></div> : <>
        <Suspense fallback={<p id="ficha-titulo" role="status">Cargando ficha…</p>}><DetalleFicha key={lab.idLab} laboratorio={lab} pagina={Boolean(inicial)} /></Suspense>
      </>}
  </>;
  if (inicial) return <article className={styles.pagina} aria-labelledby="ficha-titulo">{ficha}</article>;
  return <dialog ref={dialogo} className={styles.ficha} aria-labelledby="ficha-titulo" onClose={() => { peticion.current++; if (enHistorial.current) { enHistorial.current = false; window.history.back(); } disparador.current?.focus({ preventScroll: true }); }} onClick={(event) => { if (event.target === event.currentTarget) dialogo.current?.close(); }}>
    <button type="button" className={styles["ficha-cerrar"]} aria-label="Cerrar ficha" onClick={() => dialogo.current?.close()}><Icono nombre="cerrar" tamano={16} /></button>
    {ficha}
  </dialog>;
}
