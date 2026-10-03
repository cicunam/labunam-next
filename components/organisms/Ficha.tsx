"use client";

import { useEffect, useRef, useState } from "react";
import { pedirFicha, type DatosFicha } from "@/lib/ficha";
import { cifras, redes } from "@/lib/presentacion";
import { Galeria } from "../molecules/Galeria";
import { Pestana } from "../molecules/Pestana";
import { Insignia } from "../atoms/Insignia";
import { Icono } from "../atoms/Icono";
import styles from "./Ficha.module.css";

const pestanas = ["Servicios", "Equipamiento", "Distinciones", "Ubicación"];
export function Ficha({ cargar = pedirFicha }: { cargar?: (id: number) => Promise<DatosFicha> }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const disparador = useRef<HTMLElement | null>(null);
  const memoria = useRef(new Map<number, Promise<DatosFicha>>());
  const peticion = useRef(0);
  const [lab, setLab] = useState<DatosFicha | null>(null);
  const [error, setError] = useState("");
  const [activa, setActiva] = useState(0);
  useEffect(() => {
    let vigente = true;
    async function abrir(event: MouseEvent) {
      const boton = (event.target as HTMLElement).closest<HTMLElement>("[data-ficha]");
      if (!boton) return;
      const id = Number(boton.dataset.ficha);
      if (!Number.isSafeInteger(id) || id <= 0) return;
      const turno = ++peticion.current;
      disparador.current = boton; setLab(null); setError(""); setActiva(0);
      dialogo.current?.showModal();
      if (!memoria.current.has(id)) memoria.current.set(id, cargar(id).catch((error) => { memoria.current.delete(id); throw error; }));
      try {
        const datos = await memoria.current.get(id)!;
        if (vigente && turno === peticion.current) setLab(datos);
      } catch { if (vigente && turno === peticion.current) setError("No se pudo cargar la ficha. Ciérrala y vuelve a intentarlo."); }
    }
    document.addEventListener("click", abrir);
    return () => { vigente = false; document.removeEventListener("click", abrir); };
  }, [cargar]);
  const contenido = lab ? [lab.servicios, lab.equipos, lab.distinciones, [lab.sedeNombre, lab.ubicacion].filter(Boolean)] : [];
  return (
    <dialog ref={dialogo} className={styles.ficha} aria-labelledby="ficha-titulo" onClose={() => { peticion.current++; disparador.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) dialogo.current?.close(); }}>
      <button type="button" className={styles["ficha-cerrar"]} aria-label="Cerrar ficha" onClick={() => dialogo.current?.close()}><Icono nombre="cerrar" tamano={16} /></button>
      {!lab ? <div className={styles.estado}><h2 id="ficha-titulo">Ficha del laboratorio</h2><p role={error ? "alert" : "status"}>{error || "Cargando…"}</p></div> : <>
        <div className={styles["ficha-cuerpo"]}>
          <Galeria imagenes={lab.galeria} />
          <div className={styles["ficha-encabezado"]}>
            <Insignia tono={redes[lab.tipo].tono}>{redes[lab.tipo].singular}</Insignia>
            <h2 id="ficha-titulo" className={styles["ficha-titulo"]}>{lab.nombre}</h2>
            <p className={styles["ficha-entidad"]}>{lab.entidad}</p><p className={styles["ficha-sede"]}>{lab.sedeNombre}</p>
          </div>
          <div className={styles["ficha-pestanas"]} role="tablist" aria-label="Información del laboratorio">
            {pestanas.map((nombre, i) => <Pestana key={nombre} id={`ficha-pestana-${i}`} panelId={`ficha-panel-${i}`} seleccionada={activa === i} onClick={() => setActiva(i)} onKeyDown={(event) => {
              let siguiente = i;
              if (event.key === "ArrowRight") siguiente = (i + 1) % 4;
              else if (event.key === "ArrowLeft") siguiente = (i + 3) % 4;
              else if (event.key === "Home") siguiente = 0;
              else if (event.key === "End") siguiente = 3;
              else return;
              event.preventDefault(); setActiva(siguiente);
              dialogo.current?.querySelector<HTMLButtonElement>(`#ficha-pestana-${siguiente}`)?.focus();
            }}>{nombre}</Pestana>)}
          </div>
          {contenido.map((lista, i) => <div key={i} className={styles["ficha-panel"]} id={`ficha-panel-${i}`} role="tabpanel" aria-labelledby={`ficha-pestana-${i}`} tabIndex={0} hidden={activa !== i}>
            {lista.length ? <ul className={styles["ficha-lista"]}>{lista.map((texto, n) => <li key={n}>{texto}</li>)}</ul> : <p className={styles["ficha-vacio"]}>Sin información registrada todavía.</p>}
            {i === 3 && lab.mapa && <a className={styles["ficha-mapa"]} href={lab.mapa} target="_blank" rel="noopener">Ver en el mapa</a>}
          </div>)}
        </div>
        <footer className={styles["ficha-pie"]}>
          <p className={styles["ficha-pie-nota"]}>{cifras(lab.servicios.length, lab.equipos.length)}</p>
          {lab.sitio && <a className={styles["ficha-sitio"]} href={lab.sitio} target="_blank" rel="noopener">Sitio web ↗</a>}
        </footer>
      </>}
    </dialog>
  );
}
