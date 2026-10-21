"use client";

// LabUNAM
// Organismos
// LaboratoryField (campo «Laboratorio de interés» con sugerencias del catálogo)
// Ángelo M

// Dependencias
import { useEffect, useState } from "react";
import { findLaboratorio, laboratorioLabel } from "@/lib/solicitudes/solicitudes";
import { MIN_SEARCH_LENGTH } from "@/lib/coincidencias/coincidencias";
import { fetchLaboratorioSuggestions } from "@/lib/api/api";

// Componentes
import SuggestionField from "../../molecules/SuggestionField/SuggestionField";

// Estilos
import styles from "./LaboratoryField.module.css";

// Definición del componente
// Es opcional: vacío significa «necesito orientación». Lo que viaja es id_laboratorio, no el texto.
const LaboratoryField = ({
  laboratorio = null, // Object Optional - Laboratorio inicial de ?laboratorio: idLab, nombre y entidad
  loadLaboratorios = fetchLaboratorioSuggestions, // Function Optional - Recibe (texto, signal) y devuelve una promesa con laboratorios { idLab, nombre, entidad }
}) => {
  // Referencias y estado
  const [text, setText] = useState(laboratorio ? laboratorioLabel(laboratorio) : "");
  const [laboratorios, setLaboratorios] = useState(laboratorio ? [laboratorio] : []);
  useEffect(() => {
    // Se envía el texto completo: el servidor busca como el catálogo y, si es una sugerencia ya
    // elegida («Nombre — Entidad»), la devuelve primero para que el campo la siga reconociendo.
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
      : laboratorios.map((item) => ({ clave: String(item.idLab), nombre: laboratorioLabel(item) }));
  const selected = findLaboratorio(laboratorios, text);

  // Interfaz
  return (
    <div className={styles.field}>
      <SuggestionField
        label="Laboratorio de interés"
        controlId="request-laboratorio"
        options={options}
        value={text}
        onChange={setText}
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
      {/* Los nombres largos se cortan dentro del campo; la entidad se repite aquí completa. */}
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
