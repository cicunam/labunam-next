"use client";

import { useId, useState } from "react";
import Link from "next/link";
import estados from "@/lib/mapa/estados.json";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";
import styles from "./LaboratoryMap.module.css";

const LaboratoryMap = ({ locations = [] }) => {
  const id = useId();
  const available = estados.map((estado) => ({
    ...estado,
    total: locations.find((sede) => sede.clave === estado.clave)?.total ?? 0,
  }));
  const [selection, setSelection] = useState("");
  const initial = [...available].sort((a, b) => b.total - a.total)[0];
  const activeItem = available.find((estado) => estado.clave === selection) ?? initial;
  const withLaboratorios = available.filter((estado) => estado.total > 0).length;

  function handleStateKey(event, key) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelection(key);
    }
  }

  return (
    <section
      className={`content ${styles.section}`}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Ciencia cerca de ti</p>
          <h2
            id={`${id}-title`}
            className="band-title"
          >
            Encuentra laboratorios por estado
          </h2>
          <p className="band-entry">
            Explora el mapa y descubre dónde están nuestras capacidades científicas.
          </p>
        </div>
        <span className={styles.presence}>{withLaboratorios} estados con laboratorios</span>
      </div>
      <div className={styles.layout}>
        <div className={styles.mapArea}>
          <svg
            className={styles.map}
            viewBox="-8 -8 992 672"
            role="group"
            aria-label="Mapa de laboratorios por estado"
          >
            {available.map((estado) => (
              <g
                key={estado.id}
                role="button"
                tabIndex={0}
                className={styles.state}
                data-available={estado.total > 0}
                aria-pressed={activeItem.clave === estado.clave}
                aria-label={`${estado.etiqueta}: ${estado.total} laboratorios`}
                onClick={() => setSelection(estado.clave)}
                onKeyDown={(event) => handleStateKey(event, estado.clave)}
              >
                {/* Un único texto evita diferencias de nodos al hidratar el title del SVG. */}
                <title>{`${estado.etiqueta}: ${estado.total} laboratorios`}</title>
                <use href={`/assets/maps/mexico.svg#${estado.id}`} />
              </g>
            ))}
          </svg>
          <div
            className={styles.legend}
            aria-hidden="true"
          >
            <span>
              <i />
              Con laboratorios
            </span>
            <span>
              <i className={styles.selected} />
              Seleccionado
            </span>
            <span>
              <i className={styles.empty} />
              Sin registros
            </span>
          </div>
        </div>
        <div className={styles.panel}>
          <label htmlFor={`${id}-state`}>Selecciona un estado</label>
          <select
            id={`${id}-state`}
            value={activeItem.clave}
            onChange={(event) => setSelection(event.target.value)}
          >
            {available.map((estado) => (
              <option
                key={estado.clave}
                value={estado.clave}
              >
                {estado.etiqueta}
              </option>
            ))}
          </select>
          <div
            className={styles.summary}
            aria-live="polite"
            aria-atomic="true"
          >
            <p className={styles.count}>{activeItem.total}</p>
            <p className={styles.caption}>
              {activeItem.total === 1 ? "laboratorio en" : "laboratorios en"}
            </p>
            <h3>{activeItem.etiqueta}</h3>
            {!activeItem.total && (
              <p className={styles.noResults}>
                Todavía no hay laboratorios registrados en este estado. Explora otro estado del
                mapa.
              </p>
            )}
          </div>
          {activeItem.total > 0 && (
            <Link
              className={styles.cta}
              href={getCatalogUrl({ sede: activeItem.clave })}
            >
              Ver laboratorios en {activeItem.etiqueta}
              <span aria-hidden="true">↗</span>
            </Link>
          )}
          <Link
            className={styles.all}
            href="/laboratorios"
          >
            Explorar todos los laboratorios →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LaboratoryMap;
