"use client";

// LabUNAM
// Organismos
// SearchBar (buscador principal con sugerencias, red y sede)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { redes } from "@/lib/redes/redes";
import { getCatalogUrl } from "@/lib/presentacion/presentacion";

// Mecanismos
import { useSearchSuggestions } from "./useSearchSuggestions";

// Componentes
import Icon from "../../atoms/Icon/Icon";
import Autocomplete from "../../molecules/Autocomplete/Autocomplete";

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
    input,
    form,
    options,
    selectSuggestion,
    handleSearchChange,
    handleSearchFocus,
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
                <Autocomplete
                  inputRef={input}
                  className={styles["search-input"]}
                  id="search-q"
                  name="q"
                  type="search"
                  value={q}
                  placeholder="Laboratorio, técnica o equipo"
                  autoCapitalize="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  options={options.map((option) => ({
                    key: option.texto,
                    label: option.texto,
                    note: option.reciente ? "reciente" : undefined,
                  }))}
                  query={q}
                  onSelect={(option) => selectSuggestion(option.label)}
                  listClassName={styles["search-list"]}
                  icon={
                    <Icon
                      name="search"
                      size={16}
                    />
                  }
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
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
                {Object.entries(redes).map(([tipo, red]) => (
                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {red.corto}
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
