"use client";

// LabUNAM
// Organismos
// InstitutionFields (institución con sugerencias del servidor, dependencia de la UNAM y cargo)
// Ángelo M

// Dependencias
import { useEffect, useState } from "react";
import { findOption, isUnam } from "@/lib/solicitudes/solicitudes";
import { MIN_SEARCH_LENGTH } from "@/lib/instituciones/instituciones";
import { fetchInstitutions } from "@/lib/api/api";

// Componentes
import SuggestionField from "../../molecules/SuggestionField/SuggestionField";
import FormField from "../../molecules/FormField/FormField";
import Select from "../../atoms/Select/Select";

// Definición del componente
// Las instituciones son miles: se piden al servidor tras una pausa breve en la escritura.
const InstitutionFields = ({
  catalogos, // Object - Catálogos públicos: dependencias y cargos
  loadInstitutions = fetchInstitutions, // Function Optional - Recibe (texto, signal) y devuelve una promesa con instituciones { clave, nombre, siglas }
}) => {
  // Referencias y estado
  const [institucionText, setInstitucionText] = useState("");
  const [dependenciaText, setDependenciaText] = useState("");
  const [suggestions, setSuggestions] = useState({ text: "", options: [] });
  useEffect(() => {
    const text = institucionText.trim();
    if (text.length < MIN_SEARCH_LENGTH) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      loadInstitutions(text, controller.signal)
        .then((options) => setSuggestions({ text, options }))
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions({ text, options: [] });
          }
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [institucionText, loadInstitutions]);

  // Preparación de datos
  const options =
    institucionText.trim().length < MIN_SEARCH_LENGTH
      ? []
      : suggestions.options.map((option) => ({ ...option, detail: option.siglas }));
  const institucion = findOption(options, institucionText);
  const dependencia = findOption(catalogos.dependencias, dependenciaText);
  const unam = isUnam(institucion?.nombre);

  // Interfaz
  return (
    <>
      {/* Una institución que no está en el catálogo se conserva como texto libre, igual que en la versión anterior. */}
      <SuggestionField
        label="Institución"
        controlId="request-institucion"
        options={options}
        value={institucionText}
        onChange={(text) => {
          setInstitucionText(text);
          setDependenciaText("");
        }}
        required
        wide
        placeholder="Escribe al menos dos letras"
        hint="Elige una sugerencia; si no aparece, escribe su nombre completo."
      />
      <input
        type="hidden"
        name="id_institucion"
        value={institucion?.clave ?? ""}
      />
      <input
        type="hidden"
        name="institucion_otra"
        value={institucion ? "" : institucionText.trim()}
      />
      {unam && (
        <>
          <SuggestionField
            label="Dependencia"
            controlId="request-dependencia"
            options={catalogos.dependencias}
            value={dependenciaText}
            onChange={setDependenciaText}
            valid={!dependenciaText || Boolean(dependencia)}
            message="Elige una dependencia de la lista o deja el campo vacío."
          />
          <input
            type="hidden"
            name="id_dependencia"
            value={dependencia?.clave ?? ""}
          />
        </>
      )}
      <FormField
        label="Cargo"
        controlId="request-cargo"
      >
        <Select
          id="request-cargo"
          name="id_cargo"
          defaultValue=""
        >
          <option value="">Selecciona un cargo</option>
          {catalogos.cargos.map(({ clave, nombre }) => (
            <option
              key={clave}
              value={clave}
            >
              {nombre}
            </option>
          ))}
        </Select>
      </FormField>
    </>
  );
};

export default InstitutionFields;
