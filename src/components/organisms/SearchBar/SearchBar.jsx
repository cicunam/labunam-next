"use client";

// LabUNAM
// Organismos
// SearchBar (buscador principal con sugerencias, red y sede)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";
import { normalizeText } from "@/lib/texto/texto";

// Mecanismos
import { useSearchSuggestions } from "./useSearchSuggestions";

// Componentes
import Icon from "../../atoms/Icon/Icon";

// Estilos
import styles from "./SearchBar.module.css";

// Definición del componente
const SearchBar = ({
  title, // String - Encabezado principal de la sección
  criteria = {}, // Object Optional - Criterios activos; rellenan el formulario y los demás filtros viajan como campos ocultos
  locations, // Array - Sedes con clave y etiqueta para el selector
  suggestions, // Array - Textos (String) que se sugieren mientras se escribe
  popularSearches = [], // Array Optional - Búsquedas rápidas (String) que se muestran bajo el formulario
}) => {
  // Mecanismos
  const {
    q,
    activeIndex,
    input,
    form,
    options,
    visible,
    selectSuggestion,
    handleSearchChange,
    handleSearchFocus,
    handleSuggestionKeyDown,
    clearSearch,
    handleSubmit,
  } = useSearchSuggestions({ criteria, suggestions });

  // Interfaz
  return (
    <div
      className={styles.block}
      data-search
    >
      <div className={styles.search}>
        <h1 className={styles["search-title"]}>{title}</h1>
        <form
          ref={form}
          className={styles["search-form"]}
          method="get"
          action="/laboratorios"
          role="search"
          aria-label="Buscar laboratorios"
          onSubmit={handleSubmit}
        >
          {Object.entries(criteria)
            .filter(([eje, value]) => !["q", "tipo", "sede"].includes(eje) && value)
            .map(([eje, value]) => (
              <input
                key={eje}
                type="hidden"
                name={eje}
                value={value}
              />
            ))}
          <div className={styles["search-bar"]}>
            <div className={`${styles["search-segment"]} ${styles["search-segment-width"]}`}>
              <label
                className={styles["search-label"]}
                htmlFor="search-q"
              >
                Qué buscas
              </label>
              <div className={styles["search-control"]}>
                <input
                  ref={input}
                  className={styles["search-input"]}
                  id="search-q"
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
                  aria-controls="search-list"
                  aria-activedescendant={
                    visible && activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
                  }
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleSuggestionKeyDown}
                />

                {q && (
                  <button
                    className={styles["search-clear"]}
                    type="button"
                    aria-label="Borrar búsqueda"
                    onClick={clearSearch}
                  >
                    <Icon
                      name="close"
                      size={16}
                    />
                  </button>
                )}
              </div>
              <ul
                id="search-list"
                className={styles["search-list"]}
                role="listbox"
                aria-label="Sugerencias"
                hidden={!visible}
              >
                {options.map((option, i) => {
                  const start = q.trim()
                    ? normalizeText(option.texto).indexOf(normalizeText(q))
                    : -1;
                  return (
                    <li
                      id={`search-option-${i}`}
                      key={option.texto}
                      className={styles["search-option"]}
                      role="option"
                      aria-selected={activeIndex === i}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => selectSuggestion(option.texto)}
                    >
                      <Icon
                        name="search"
                        size={16}
                      />

                      <span className={styles["search-option-text"]}>
                        {start >= 0 ? (
                          <>
                            {option.texto.slice(0, start)}
                            <mark>{option.texto.slice(start, start + q.trim().length)}</mark>
                            {option.texto.slice(start + q.trim().length)}
                          </>
                        ) : (
                          option.texto
                        )}
                      </span>
                      {option.reciente && (
                        <span className={styles["search-option-note"]}>reciente</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <span
              className={styles["search-border"]}
              aria-hidden="true"
            />

            <div className={styles["search-segment"]}>
              <label
                className={styles["search-label"]}
                htmlFor="search-type"
              >
                Red
              </label>
              <select
                className={styles["search-select"]}
                id="search-type"
                name="tipo"
                defaultValue={criteria.tipo ?? ""}
              >
                <option value="">Todas las redes</option>
                {Object.entries(redes).map(([tipo, network]) => (
                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {tipo === "nacionales"
                      ? "Nacionales"
                      : tipo === "universitarios"
                        ? "Universitarios"
                        : network.nombre}
                  </option>
                ))}
              </select>
            </div>
            <span
              className={styles["search-border"]}
              aria-hidden="true"
            />

            <div className={styles["search-segment"]}>
              <label
                className={styles["search-label"]}
                htmlFor="search-location"
              >
                Sede
              </label>
              <select
                className={styles["search-select"]}
                id="search-location"
                name="sede"
                defaultValue={criteria.sede ?? ""}
              >
                <option value="">Cualquier sede</option>
                {locations.map((sede) => (
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
              className={styles["search-orb"]}
              type="submit"
              aria-label="Buscar"
            >
              <Icon
                name="search"
                size={18}
              />

              <span className={styles["search-text"]}>Buscar</span>
            </button>
          </div>
        </form>
        {popularSearches.length > 0 && (
          <p className={styles["search-popular"]}>
            {popularSearches.map((q) => (
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
