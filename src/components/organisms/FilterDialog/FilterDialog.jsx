"use client";

// LabUNAM
// Organismos
// FilterDialog (barra de áreas y diálogo de filtros con conteos en vivo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useRef } from "react";

// Mecanismos
import { useFilterDraft } from "./useFilterDraft";

// Componentes
import FilterOption from "../../molecules/FilterOption/FilterOption";
import Icon from "../../atoms/Icon/Icon";

// Estilos
import styles from "./FilterDialog.module.css";

// Definición del componente
const FilterDialog = ({
  criteria, // Object - Criterios aplicados en la URL; son el punto de partida del borrador
  filters, // Array - Filtros del diálogo calculados en el servidor: eje, etiqueta, cualquiera y opciones con clave, etiqueta y total
  total, // Number - Laboratorios que coinciden con los criterios aplicados
  children, // ReactNode Optional - Contenido de la barra horizontal; en el catálogo es DisciplineBar
}) => {
  // Referencias y estado
  const dialog = useRef(null);

  // Mecanismos
  const { selection, data, pending, error, updateSelection } = useFilterDraft({
    criteria,
    filters,
    total,
  });

  // Preparación de datos
  const activeCount = Object.values(criteria).filter(Boolean).length;

  // Gestores de evento
  function openDialog() {
    dialog.current?.showModal();
  }

  function closeDialog() {
    dialog.current?.close();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  // Interfaz
  return (
    <div className={styles.strip}>
      {children}
      <button
        type="button"
        className={styles["strip-filters"]}
        aria-label="Filtros"
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        <Icon
          name="all"
          size={16}
        />
        Filtros
        {activeCount > 0 && <span className={styles["strip-filters-count"]}>{activeCount}</span>}
      </button>
      <dialog
        ref={dialog}
        className={styles.modal}
        aria-labelledby="filters-title"
        onClick={handleBackdropClick}
      >
        <header className={styles["modal-header"]}>
          <button
            type="button"
            className={styles["modal-close"]}
            aria-label="Cerrar filtros"
            onClick={closeDialog}
          >
            <Icon
              name="close"
              size={16}
            />
          </button>
          <h2
            id="filters-title"
            className={styles["modal-title"]}
          >
            Filtros
          </h2>
        </header>
        <form
          method="get"
          action="/laboratorios"
          className={styles.form}
        >
          {["q", "tipo"].map((eje) => (
            <input
              key={eje}
              type="hidden"
              name={eje}
              value={selection[eje] ?? ""}
            />
          ))}
          <div className={styles["modal-body"]}>
            {data.filters.map((filtro) => (
              <fieldset
                key={filtro.eje}
                className={styles["modal-group"]}
              >
                <legend className={styles["modal-group-title"]}>{filtro.etiqueta}</legend>
                <div className={styles["modal-options"]}>
                  <FilterOption
                    name={filtro.eje}
                    value=""
                    label="Cualquiera"
                    selected={!selection[filtro.eje]}
                    onChange={() => updateSelection({ ...selection, [filtro.eje]: "" })}
                  />

                  {filtro.opciones.map((option) => (
                    <FilterOption
                      key={option.clave}
                      name={filtro.eje}
                      value={option.clave}
                      label={option.etiqueta}
                      total={option.total}
                      selected={selection[filtro.eje] === option.clave}
                      onChange={() => updateSelection({ ...selection, [filtro.eje]: option.clave })}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
            {error && <p role="alert">{error}</p>}
          </div>
          <footer className={styles["modal-footer"]}>
            <button
              type="button"
              className={styles["modal-clear"]}
              onClick={() => updateSelection({})}
            >
              Limpiar todo
            </button>
            <button
              type="submit"
              className={styles["modal-apply"]}
              disabled={pending}
            >
              {pending
                ? "Actualizando…"
                : `Ver ${data.total} ${data.total === 1 ? "laboratorio" : "laboratorios"}`}
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
};

export default FilterDialog;
