"use client";

import { useId, useState } from "react";
import Link from "next/link";
import estados from "@/lib/mapa/estados.json";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";
import styles from "./LaboratoryMap.module.css";

export function LaboratoryMap({ sedes = [] }) {
  const id = useId();
  const disponibles = estados.map((estado) => ({
    ...estado, total: sedes.find((sede) => sede.clave === estado.clave)?.total ?? 0,
  }));
  const [seleccion, setSelection] = useState("");
  const inicial = [...disponibles].sort((a, b) => b.total - a.total)[0];
  const activo = disponibles.find((estado) => estado.clave === seleccion) ?? inicial;
  const conLaboratorios = disponibles.filter((estado) => estado.total > 0).length;

  function handleStateKey(event, clave) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelection(clave);
    }
  }

  return <section className={`contenido ${styles.section}`} aria-labelledby={`${id}-title`}>
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>Ciencia cerca de ti</p>
        <h2 id={`${id}-title`} className="banda-titulo">Encuentra laboratorios por estado</h2>
        <p className="banda-entrada">Explora el mapa y descubre dónde están nuestras capacidades científicas.</p>
      </div>
      <span className={styles.presence}>{conLaboratorios} estados con laboratorios</span>
    </div>
    <div className={styles.layout}>
      <div className={styles.mapArea}>
        <svg className={styles.map} viewBox="-8 -8 992 672" role="group" aria-label="Mapa de laboratorios por estado">
          {disponibles.map((estado) => <g key={estado.id} role="button" tabIndex={0}
            className={styles.state} data-available={estado.total > 0} aria-pressed={activo.clave === estado.clave}
            aria-label={`${estado.etiqueta}: ${estado.total} laboratorios`} onClick={() => setSelection(estado.clave)}
            onKeyDown={(event) => handleStateKey(event, estado.clave)}>
            <title>{estado.etiqueta}: {estado.total} laboratorios</title>
            <use href={`/assets/maps/mexico.svg#${estado.id}`} />
          </g>)}
        </svg>
        <div className={styles.legend} aria-hidden="true">
          <span><i />Con laboratorios</span><span><i className={styles.selected} />Seleccionado</span>
          <span><i className={styles.empty} />Sin registros</span>
        </div>
      </div>
      <div className={styles.panel}>
        <label htmlFor={`${id}-state`}>Selecciona un estado</label>
        <select id={`${id}-state`} value={activo.clave} onChange={(event) => setSelection(event.target.value)}>
          {disponibles.map((estado) => <option key={estado.clave} value={estado.clave}>{estado.etiqueta}</option>)}
        </select>
        <div className={styles.summary} aria-live="polite" aria-atomic="true">
          <p className={styles.count}>{activo.total}</p>
          <p className={styles.caption}>{activo.total === 1 ? "laboratorio en" : "laboratorios en"}</p>
          <h3>{activo.etiqueta}</h3>
          {!activo.total && <p className={styles.noResults}>Todavía no hay laboratorios registrados en este estado. Explora otro estado del mapa.</p>}
        </div>
        {activo.total > 0 && <Link className={styles.cta} href={getCatalogUrl({ sede: activo.clave })}>
          Ver laboratorios en {activo.etiqueta}<span aria-hidden="true">↗</span>
        </Link>}
        <Link className={styles.all} href="/laboratorios">Explorar todos los laboratorios →</Link>
      </div>
    </div>
  </section>;
}
