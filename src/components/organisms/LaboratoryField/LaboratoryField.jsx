"use client";

// LabUNAM
// Organismos
// LaboratoryField (campo «Laboratorio de interés» con sugerencias del catálogo)
// Ángelo M

// Dependencias
import { useEffect, useState } from "react";
import { MIN_SEARCH_LENGTH, findUniqueByName } from "@/lib/coincidencias/coincidencias";
import { fetchLaboratorioSuggestions } from "@/lib/api/api";

// Componentes
import SuggestionField from "../../molecules/SuggestionField/SuggestionField";

// Estilos
import styles from "./LaboratoryField.module.css";

// Definición del componente
// Es opcional: vacío significa «necesito orientación». El campo muestra sólo el nombre y lo que
// viaja es id_laboratorio del laboratorio elegido, porque hay nombres repetidos en distintas entidades.
const LaboratoryField = ({
  laboratorio = null, // Object Optional - Laboratorio inicial de ?laboratorio: idLab, nombre y entidad
  loadLaboratorios = fetchLaboratorioSuggestions, // Function Optional - Recibe (texto, signal) y devuelve una promesa con laboratorios { idLab, nombre, entidad }
}) => {
  // Referencias y estado
  const [text, setText] = useState(laboratorio?.nombre ?? "");
  const [chosen, setChosen] = useState(laboratorio);
  const [laboratorios, setLaboratorios] = useState(laboratorio ? [laboratorio] : []);
  useEffect(() => {
    // El servidor busca como el catálogo y pone primero el nombre que coincide completo.
    const query = text.trim();
    if (query.length < MIN_SEARCH_LENGTH) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      loadLaboratorios(query, controller.signal)
        .then(setLaboratorios)
        .catch(() => {
          if (!controller.signal.aborted) {
            setLaboratorios([]);
          }
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, loadLaboratorios]);

  // Preparación de datos
  const options =
    text.trim().length < MIN_SEARCH_LENGTH
      ? []
      : laboratorios.map((item) => ({
          clave: String(item.idLab),
          nombre: item.nombre,
          detail: item.entidad,
        }));
  // El elegido de la lista manda; sin elección, se acepta el nombre escrito si no se repite.
  const selected = chosen ?? findUniqueByName(laboratorios, text);

  // Gestores de evento
  // Editar el texto después de elegir borra la elección: el id oculto nunca debe apuntar a un
  // laboratorio distinto del nombre que se ve.
  function handleChange(
    value, // String - Texto nuevo del campo
  ) {
    setText(value);
    if (chosen && value !== chosen.nombre) {
      setChosen(null);
    }
  }

  function handleSelect(
    option, // Object - Opción elegida { clave, nombre }
  ) {
    setChosen(laboratorios.find((item) => String(item.idLab) === option.clave) ?? null);
  }

  // Interfaz
  return (
    <div className={styles.field}>
      <SuggestionField
        label="Laboratorio de interés"
        controlId="request-laboratorio"
        options={options}
        filter={false}
        value={text}
        onChange={handleChange}
        onSelect={handleSelect}
        valid={!text.trim() || Boolean(selected)}
        message="Elige un laboratorio de la lista o deja el campo vacío."
        placeholder="Escribe el nombre del laboratorio"
        hint="Opcional. Si no sabes cuál elegir, déjalo vacío y te orientaremos."
        wide
      />
      <input
        type="hidden"
        name="id_laboratorio"
        value={selected?.idLab ?? ""}
      />
      {/* La entidad distingue laboratorios con el mismo nombre; el nombre largo puede cortarse en el campo. */}
      {selected && (
        <p className={styles.selected}>
          {selected.entidad && <span>{selected.entidad} · </span>}
          <a
            href={`/laboratorios/${selected.idLab}`}
            target="_blank"
            rel="noopener"
          >
            Ver la ficha del laboratorio<span aria-hidden="true"> ↗</span>
            <span className={styles.hidden}> (se abre en una pestaña nueva)</span>
          </a>
        </p>
      )}
    </div>
  );
};

export default LaboratoryField;
