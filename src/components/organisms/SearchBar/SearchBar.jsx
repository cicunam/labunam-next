"use client";

import Link from "next/link";
import { useSearchSuggestions } from "./useSearchSuggestions";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";
import { normalizeText } from "@/lib/texto/texto";
import Icon from "../../atoms/Icon/Icon";
import styles from "./SearchBar.module.css";

const SearchBar = ({ titulo, criterios = {}, sedes, sugerencias, frecuentes = [] }) => {
  const {
    q,
    activa,
    input,
    form,
    opciones,
    visible,
    selectSuggestion,
    handleSearchChange,
    handleSearchFocus,
    handleSuggestionKeyDown,
    clearSearch,
    handleSubmit,
  } = useSearchSuggestions({ criterios, sugerencias });

  return (
    <div
      className={styles.bloque}
      data-buscador
    >
      <div className={styles.search}>
        <h1 className={styles["search-titulo"]}>{titulo}</h1>
        <form
          ref={form}
          className={styles["search-form"]}
          method="get"
          action="/laboratorios"
          role="search"
          aria-label="Buscar laboratorios"
          onSubmit={handleSubmit}
        >
          {Object.entries(criterios)
            .filter(([eje, valor]) => !["q", "tipo", "sede"].includes(eje) && valor)
            .map(([eje, valor]) => (
              <input
                key={eje}
                type="hidden"
                name={eje}
                value={valor}
              />
            ))}
          <div className={styles.buscador}>
            <div className={`${styles["buscador-segmento"]} ${styles["buscador-segmento-ancho"]}`}>
              <label
                className={styles["buscador-etiqueta"]}
                htmlFor="busqueda-q"
              >
                Qué buscas
              </label>
              <div className={styles["buscador-control"]}>
                <input
                  ref={input}
                  className={styles["search-input"]}
                  id="busqueda-q"
                  name="q"
                  type="search"
                  value={q}
                  placeholder="Laboratorio, técnica o equipo"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={visible}
                  aria-controls="busqueda-lista"
                  aria-activedescendant={
                    visible && activa >= 0 ? `busqueda-opcion-${activa}` : undefined
                  }
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleSuggestionKeyDown}
                />
                {q && (
                  <button
                    className={styles["search-limpiar"]}
                    type="button"
                    aria-label="Borrar búsqueda"
                    onClick={clearSearch}
                  >
                    <Icon
                      nombre="cerrar"
                      tamano={16}
                    />
                  </button>
                )}
              </div>
              <ul
                id="busqueda-lista"
                className={styles["search-lista"]}
                role="listbox"
                aria-label="Sugerencias"
                hidden={!visible}
              >
                {opciones.map((opcion, i) => {
                  const inicio = q.trim()
                    ? normalizeText(opcion.texto).indexOf(normalizeText(q))
                    : -1;
                  return (
                    <li
                      id={`busqueda-opcion-${i}`}
                      key={opcion.texto}
                      className={styles["search-opcion"]}
                      role="option"
                      aria-selected={activa === i}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => selectSuggestion(opcion.texto)}
                    >
                      <Icon
                        nombre="buscar"
                        tamano={16}
                      />
                      <span className={styles["search-opcion-texto"]}>
                        {inicio >= 0 ? (
                          <>
                            {opcion.texto.slice(0, inicio)}
                            <mark>{opcion.texto.slice(inicio, inicio + q.trim().length)}</mark>
                            {opcion.texto.slice(inicio + q.trim().length)}
                          </>
                        ) : (
                          opcion.texto
                        )}
                      </span>
                      {opcion.reciente && (
                        <span className={styles["search-opcion-nota"]}>reciente</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <span
              className={styles["buscador-filete"]}
              aria-hidden="true"
            />
            <div className={styles["buscador-segmento"]}>
              <label
                className={styles["buscador-etiqueta"]}
                htmlFor="busqueda-tipo"
              >
                Red
              </label>
              <select
                className={styles["buscador-select"]}
                id="busqueda-tipo"
                name="tipo"
                defaultValue={criterios.tipo ?? ""}
              >
                <option value="">Todas las redes</option>
                {Object.entries(redes).map(([tipo, red]) => (
                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {tipo === "nacionales"
                      ? "Nacionales"
                      : tipo === "universitarios"
                        ? "Universitarios"
                        : red.nombre}
                  </option>
                ))}
              </select>
            </div>
            <span
              className={styles["buscador-filete"]}
              aria-hidden="true"
            />
            <div className={styles["buscador-segmento"]}>
              <label
                className={styles["buscador-etiqueta"]}
                htmlFor="busqueda-sede"
              >
                Sede
              </label>
              <select
                className={styles["buscador-select"]}
                id="busqueda-sede"
                name="sede"
                defaultValue={criterios.sede ?? ""}
              >
                <option value="">Cualquier sede</option>
                {sedes.map((sede) => (
                  <option
                    key={sede.clave}
                    value={sede.clave}
                  >
                    {sede.etiqueta}
                  </option>
                ))}
              </select>
            </div>
            <button
              className={styles["buscador-orbe"]}
              type="submit"
              aria-label="Buscar"
            >
              <Icon
                nombre="buscar"
                tamano={18}
              />
              <span className={styles["buscar-texto"]}>Buscar</span>
            </button>
          </div>
        </form>
        {frecuentes.length > 0 && (
          <p className={styles["search-frecuentes"]}>
            {frecuentes.map((q) => (
              <Link
                key={q}
                href={getCatalogUrl({ q })}
              >
                {q}
              </Link>
            ))}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
