"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveRecentSearch, readRecentSearches, getSearchOptions } from "@/lib/sugerencias/sugerencias";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";
import { normalizeText } from "@/lib/texto/texto";
import { Icon } from "../../atoms/Icon/Icon";
import styles from "./SearchBar.module.css";
export function SearchBar({ titulo, criterios = {}, sedes, sugerencias, frecuentes = [] }) {
    const [q, setQ] = useState(criterios.q ?? "");
    const [recientes, setRecentSearches] = useState([]);
    const [abierto, setOpen] = useState(false);
    const [activa, setActive] = useState(-1);
    const input = useRef(null);
    const form = useRef(null);
    const opciones = getSearchOptions(q, sugerencias, recientes);
    const visible = abierto && opciones.length > 0;
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey)
                return;
            if (document.querySelector("dialog[open]"))
                return;
            const target = event.target;
            if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
                return;
            event.preventDefault();
            input.current?.focus();
            input.current?.select();
        }
        function handleOutsideClick(event) { if (!form.current?.contains(event.target))
            setOpen(false); }
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("pointerdown", handleOutsideClick);
        return () => { document.removeEventListener("keydown", handleKeyDown); document.removeEventListener("pointerdown", handleOutsideClick); };
    }, []);
    function selectSuggestion(texto) {
        if (input.current)
            input.current.value = texto;
        saveRecentSearch(texto);
        setOpen(false);
        form.current?.requestSubmit();
    }
    return (<div className={styles.bloque} data-buscador>
      <div className={styles.search}>
        <h1 className={styles["search-titulo"]}>{titulo}</h1>
        <form ref={form} className={styles["search-form"]} method="get" action="/laboratorios" role="search" aria-label="Buscar laboratorios" onSubmit={() => saveRecentSearch(input.current?.value ?? "")}>
          {Object.entries(criterios).filter(([eje, valor]) => !["q", "tipo", "sede"].includes(eje) && valor).map(([eje, valor]) => <input key={eje} type="hidden" name={eje} value={valor}/>)}
          <div className={styles.buscador}>
            <div className={`${styles["buscador-segmento"]} ${styles["buscador-segmento-ancho"]}`}>
              <label className={styles["buscador-etiqueta"]} htmlFor="busqueda-q">Qué buscas</label>
              <div className={styles["buscador-control"]}>
                <input ref={input} className={styles["search-input"]} id="busqueda-q" name="q" type="search" value={q} placeholder="Laboratorio, técnica o equipo" autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="search" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls="busqueda-lista" aria-activedescendant={visible && activa >= 0 ? `busqueda-opcion-${activa}` : undefined} onChange={(event) => { setQ(event.target.value); setActive(-1); setOpen(true); }} onFocus={() => { setRecentSearches(readRecentSearches()); setOpen(true); }} onKeyDown={(event) => {
            if (["Escape", "Tab"].includes(event.key)) {
                setOpen(false);
                setActive(-1);
                return;
            }
            if (["ArrowDown", "ArrowUp"].includes(event.key) && opciones.length) {
                event.preventDefault();
                setOpen(true);
                const siguiente = (activa + (event.key === "ArrowDown" ? 1 : -1) + opciones.length) % opciones.length;
                setActive(siguiente);
                document.getElementById(`busqueda-opcion-${siguiente}`)?.scrollIntoView({ block: "nearest" });
            }
            if (event.key === "Enter" && visible && activa >= 0) {
                event.preventDefault();
                selectSuggestion(opciones[activa].texto);
            }
        }}/>
                {q && <button className={styles["search-limpiar"]} type="button" aria-label="Borrar búsqueda" onClick={() => { setQ(""); setActive(-1); input.current?.focus(); }}><Icon nombre="cerrar" tamano={16}/></button>}
              </div>
              <ul id="busqueda-lista" className={styles["search-lista"]} role="listbox" aria-label="Sugerencias" hidden={!visible}>
                {opciones.map((opcion, i) => {
            const inicio = q.trim() ? normalizeText(opcion.texto).indexOf(normalizeText(q)) : -1;
            return <li id={`busqueda-opcion-${i}`} key={opcion.texto} className={styles["search-opcion"]} role="option" aria-selected={activa === i} onPointerDown={(event) => event.preventDefault()} onClick={() => selectSuggestion(opcion.texto)}>
                    <Icon nombre="buscar" tamano={16}/><span className={styles["search-opcion-texto"]}>{inicio >= 0 ? <>{opcion.texto.slice(0, inicio)}<mark>{opcion.texto.slice(inicio, inicio + q.trim().length)}</mark>{opcion.texto.slice(inicio + q.trim().length)}</> : opcion.texto}</span>
                    {opcion.reciente && <span className={styles["search-opcion-nota"]}>reciente</span>}
                  </li>;
        })}
              </ul>
            </div>
            <span className={styles["buscador-filete"]} aria-hidden="true"/>
            <div className={styles["buscador-segmento"]}>
              <label className={styles["buscador-etiqueta"]} htmlFor="busqueda-tipo">Red</label>
              <select className={styles["buscador-select"]} id="busqueda-tipo" name="tipo" defaultValue={criterios.tipo ?? ""}>
                <option value="">Todas las redes</option>
                {Object.entries(redes).map(([tipo, red]) => <option key={tipo} value={tipo}>{tipo === "nacionales" ? "Nacionales" : tipo === "universitarios" ? "Universitarios" : red.nombre}</option>)}
              </select>
            </div>
            <span className={styles["buscador-filete"]} aria-hidden="true"/>
            <div className={styles["buscador-segmento"]}>
              <label className={styles["buscador-etiqueta"]} htmlFor="busqueda-sede">Sede</label>
              <select className={styles["buscador-select"]} id="busqueda-sede" name="sede" defaultValue={criterios.sede ?? ""}>
                <option value="">Cualquier sede</option>{sedes.map((sede) => <option key={sede.clave} value={sede.clave}>{sede.etiqueta}</option>)}
              </select>
            </div>
            <button className={styles["buscador-orbe"]} type="submit" aria-label="Buscar"><Icon nombre="buscar" tamano={18}/><span className={styles["buscar-texto"]}>Buscar</span></button>
          </div>
        </form>
        {frecuentes.length > 0 && <p className={styles["search-frecuentes"]}>{frecuentes.map((q) => <Link key={q} href={getCatalogUrl({ q })}>{q}</Link>)}</p>}
      </div>
    </div>);
}
