"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Criterios, Opcion } from "@/lib/tipos/tipos";
import { guardarReciente, leerRecientes, opcionesBusqueda } from "@/lib/sugerencias/sugerencias";
import { redes, urlCatalogo } from "@/lib/presentacion/presentacion";
import { plano } from "@/lib/texto/texto";
import { Icono } from "../../atoms/Icono/Icono";
import styles from "./Buscador.module.css";

export function Buscador({ titulo, criterios = {}, sedes, sugerencias, frecuentes = [] }: { titulo: string; criterios?: Criterios; sedes: Opcion[]; sugerencias: string[]; frecuentes?: string[] }) {
  const [q, setQ] = useState(criterios.q ?? "");
  const [recientes, setRecientes] = useState<string[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const opciones = opcionesBusqueda(q, sugerencias, recientes);
  const visible = abierto && opciones.length > 0;
  useEffect(() => {
    function teclado(event: KeyboardEvent) {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (document.querySelector("dialog[open]")) return;
      const target = event.target as HTMLElement;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault(); input.current?.focus(); input.current?.select();
    }
    function fuera(event: PointerEvent) { if (!form.current?.contains(event.target as Node)) setAbierto(false); }
    document.addEventListener("keydown", teclado);
    document.addEventListener("pointerdown", fuera);
    return () => { document.removeEventListener("keydown", teclado); document.removeEventListener("pointerdown", fuera); };
  }, []);
  function elegir(texto: string) {
    if (input.current) input.current.value = texto;
    guardarReciente(texto);
    setAbierto(false);
    form.current?.requestSubmit();
  }
  return (
    <div className={styles.bloque} data-buscador>
      <div className={styles.search}>
        <h1 className={styles["search-titulo"]}>{titulo}</h1>
        <form ref={form} className={styles["search-form"]} method="get" action="/laboratorios" role="search" aria-label="Buscar laboratorios" onSubmit={() => guardarReciente(input.current?.value ?? "")}>
          {Object.entries(criterios).filter(([eje, valor]) => !["q", "tipo", "sede"].includes(eje) && valor).map(([eje, valor]) => <input key={eje} type="hidden" name={eje} value={valor} />)}
          <div className={styles.buscador}>
            <div className={`${styles["buscador-segmento"]} ${styles["buscador-segmento-ancho"]}`}>
              <label className={styles["buscador-etiqueta"]} htmlFor="busqueda-q">Qué buscas</label>
              <div className={styles["buscador-control"]}>
                <input ref={input} className={styles["search-input"]} id="busqueda-q" name="q" type="search" value={q} placeholder="Laboratorio, técnica o equipo" autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="search" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls="busqueda-lista" aria-activedescendant={visible && activa >= 0 ? `busqueda-opcion-${activa}` : undefined}
                  onChange={(event) => { setQ(event.target.value); setActiva(-1); setAbierto(true); }}
                  onFocus={() => { setRecientes(leerRecientes()); setAbierto(true); }}
                  onKeyDown={(event) => {
                    if (["Escape", "Tab"].includes(event.key)) { setAbierto(false); setActiva(-1); return; }
                    if (["ArrowDown", "ArrowUp"].includes(event.key) && opciones.length) {
                      event.preventDefault(); setAbierto(true);
                      const siguiente = (activa + (event.key === "ArrowDown" ? 1 : -1) + opciones.length) % opciones.length;
                      setActiva(siguiente); document.getElementById(`busqueda-opcion-${siguiente}`)?.scrollIntoView({ block: "nearest" });
                    }
                    if (event.key === "Enter" && visible && activa >= 0) { event.preventDefault(); elegir(opciones[activa].texto); }
                  }} />
                {q && <button className={styles["search-limpiar"]} type="button" aria-label="Borrar búsqueda" onClick={() => { setQ(""); setActiva(-1); input.current?.focus(); }}><Icono nombre="cerrar" tamano={16} /></button>}
              </div>
            </div>
            <span className={styles["buscador-filete"]} aria-hidden="true" />
            <div className={styles["buscador-segmento"]}>
              <label className={styles["buscador-etiqueta"]} htmlFor="busqueda-tipo">Red</label>
              <select className={styles["buscador-select"]} id="busqueda-tipo" name="tipo" defaultValue={criterios.tipo ?? ""}>
                <option value="">Todas las redes</option>
                {Object.entries(redes).map(([tipo, red]) => <option key={tipo} value={tipo}>{tipo === "nacionales" ? "Nacionales" : tipo === "universitarios" ? "Universitarios" : red.nombre}</option>)}
              </select>
            </div>
            <span className={styles["buscador-filete"]} aria-hidden="true" />
            <div className={styles["buscador-segmento"]}>
              <label className={styles["buscador-etiqueta"]} htmlFor="busqueda-sede">Sede</label>
              <select className={styles["buscador-select"]} id="busqueda-sede" name="sede" defaultValue={criterios.sede ?? ""}>
                <option value="">Cualquier sede</option>{sedes.map((sede) => <option key={sede.clave} value={sede.clave}>{sede.etiqueta}</option>)}
              </select>
            </div>
            <button className={styles["buscador-orbe"]} type="submit" aria-label="Buscar"><Icono nombre="buscar" tamano={18} /><span className={styles["buscar-texto"]}>Buscar</span></button>
          </div>
          <ul id="busqueda-lista" className={styles["search-lista"]} role="listbox" aria-label="Sugerencias" hidden={!visible}>
            {opciones.map((opcion, i) => {
              const inicio = q.trim() ? plano(opcion.texto).indexOf(plano(q)) : -1;
              return <li id={`busqueda-opcion-${i}`} key={opcion.texto} className={styles["search-opcion"]} role="option" aria-selected={activa === i} onPointerDown={(event) => event.preventDefault()} onClick={() => elegir(opcion.texto)}>
                <Icono nombre="buscar" tamano={16} /><span className={styles["search-opcion-texto"]}>{inicio >= 0 ? <>{opcion.texto.slice(0, inicio)}<mark>{opcion.texto.slice(inicio, inicio + q.trim().length)}</mark>{opcion.texto.slice(inicio + q.trim().length)}</> : opcion.texto}</span>
                {opcion.reciente && <span className={styles["search-opcion-nota"]}>reciente</span>}
              </li>;
            })}
          </ul>
        </form>
        {frecuentes.length > 0 && <p className={styles["search-frecuentes"]}>{frecuentes.map((q) => <Link key={q} href={urlCatalogo({ q })}>{q}</Link>)}</p>}
      </div>
    </div>
  );
}
