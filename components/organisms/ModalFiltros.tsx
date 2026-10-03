"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Criterios } from "@/lib/tipos";
import type { Filtro } from "@/lib/filtros";
import { OpcionFiltro } from "../molecules/OpcionFiltro";
import { Icono } from "../atoms/Icono";
import { urlCatalogo } from "@/lib/presentacion";
import styles from "./ModalFiltros.module.css";

export function ModalFiltros({ criterios, filtros, total, children }: { criterios: Criterios; filtros: Filtro[]; total: number; children: ReactNode }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const peticion = useRef<AbortController | null>(null);
  const [seleccion, setSeleccion] = useState(criterios);
  const [datos, setDatos] = useState({ filtros, total });
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const pista = barra.current?.querySelector<HTMLElement>("[data-pista]");
    const flechas = barra.current?.querySelectorAll<HTMLButtonElement>("[data-mover]");
    if (!pista || !flechas) return;
    const eventos = new AbortController();
    function actualizar() { flechas?.forEach((flecha) => { flecha.hidden = flecha.dataset.mover === "-1" ? pista!.scrollLeft < 8 : pista!.scrollWidth - pista!.clientWidth - pista!.scrollLeft < 8; }); }
    flechas.forEach((flecha) => flecha.addEventListener("click", () => pista.scrollBy({ left: Number(flecha.dataset.mover) * pista.clientWidth * .8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }), { signal: eventos.signal }));
    pista.addEventListener("scroll", actualizar, { signal: eventos.signal, passive: true });
    const resize = new ResizeObserver(actualizar); resize.observe(pista); actualizar();
    const activo = pista.querySelector<HTMLElement>('[aria-current="page"]');
    if (activo) pista.scrollLeft = Math.max(0, activo.offsetLeft - pista.clientWidth / 2);
    return () => { eventos.abort(); resize.disconnect(); peticion.current?.abort(); };
  }, []);
  async function cambiar(nombre: string, valor: string) {
    const nueva = { ...seleccion, [nombre]: valor };
    setSeleccion(nueva); setPendiente(true); setError("");
    peticion.current?.abort();
    const control = new AbortController(); peticion.current = control;
    try {
      const respuesta = await fetch(urlCatalogo(nueva).replace("/laboratorios", "/api/filtros"), { signal: control.signal });
      if (!respuesta.ok) throw new Error();
      setDatos(await respuesta.json());
    } catch { if (!control.signal.aborted) setError("No se pudieron actualizar los conteos. Puedes aplicar los filtros."); }
    finally { if (!control.signal.aborted) setPendiente(false); }
  }
  return (
    <div ref={barra} className={styles.tira}>
      {children}
      <button type="button" className={styles["tira-filtros"]} aria-label="Filtros" aria-haspopup="dialog" onClick={() => dialogo.current?.showModal()}><Icono nombre="todas" tamano={16} />Filtros{Object.values(criterios).filter(Boolean).length > 0 && <span className={styles["tira-filtros-cuenta"]}>{Object.values(criterios).filter(Boolean).length}</span>}</button>
      <dialog ref={dialogo} className={styles.modal} aria-labelledby="filtros-titulo" onClick={(event) => { if (event.target === event.currentTarget) dialogo.current?.close(); }}>
        <header className={styles["modal-cabeza"]}>
          <button type="button" className={styles["modal-cerrar"]} aria-label="Cerrar filtros" onClick={() => dialogo.current?.close()}><Icono nombre="cerrar" tamano={16} /></button>
          <h2 id="filtros-titulo" className={styles["modal-titulo"]}>Filtros</h2>
        </header>
        <form method="get" action="/laboratorios" className={styles.formulario}>
          {["q", "tipo"].map((eje) => <input key={eje} type="hidden" name={eje} value={criterios[eje as keyof Criterios] ?? ""} />)}
          <div className={styles["modal-cuerpo"]}>
            {datos.filtros.map((filtro) => <fieldset key={filtro.eje} className={styles["modal-grupo"]}>
              <legend className={styles["modal-grupo-titulo"]}>{filtro.etiqueta}</legend>
              <div className={styles["modal-opciones"]}>
                <OpcionFiltro nombre={filtro.eje} valor="" etiqueta="Cualquiera" seleccionada={!seleccion[filtro.eje]} onChange={() => cambiar(filtro.eje, "")} />
                {filtro.opciones.map((opcion) => <OpcionFiltro key={opcion.clave} nombre={filtro.eje} valor={opcion.clave} etiqueta={opcion.etiqueta} total={opcion.total} seleccionada={seleccion[filtro.eje] === opcion.clave} onChange={() => cambiar(filtro.eje, opcion.clave)} />)}
              </div>
            </fieldset>)}
            {error && <p role="alert">{error}</p>}
          </div>
          <footer className={styles["modal-pie"]}>
            <Link href="/laboratorios" className={styles["modal-limpiar"]}>Limpiar todo</Link>
            <button type="submit" className={styles["modal-aplicar"]} disabled={pendiente}>{pendiente ? "Actualizando…" : `Ver ${datos.total} ${datos.total === 1 ? "laboratorio" : "laboratorios"}`}</button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}
