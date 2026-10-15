"use client";

// LabUNAM
// Organismos
// RequestDetailsFields (tipo de solicitud y los campos de cada tipo)
// Ángelo M

// Dependencias
import { useState } from "react";
import { RULES, TIPOS_SOLICITUD, sectionFor } from "@/lib/solicitudes/solicitudes";

// Componentes
import FormSection from "../../molecules/FormSection/FormSection";
import FormField from "../../molecules/FormField/FormField";
import ChoiceGroup from "../../molecules/ChoiceGroup/ChoiceGroup";
import Select from "../../atoms/Select/Select";
import TextArea from "../../atoms/TextArea/TextArea";
import AnalysisFields from "../AnalysisFields/AnalysisFields";

// Constantes
// Cada tipo de solicitud guarda su texto principal en la misma columna `descripcion`.
const DESCRIPTION_LABELS = {
  colaboracion: "Descripción de la colaboración",
  capacitacion: "Descripción de la capacitación",
  otra: "Especifica tu solicitud",
};

// Definición del componente
const RequestDetailsFields = ({
  catalogos, // Object - Catálogos públicos: tiposMuestra y tiposColaboracion
}) => {
  // Referencias y estado
  const [tipo, setTipo] = useState("");

  // Preparación de datos
  const section = sectionFor(TIPOS_SOLICITUD, tipo);

  // Interfaz
  return (
    <FormSection title="Datos de la solicitud">
      <ChoiceGroup
        legend="Tipo de solicitud"
        name="id_tipo_solicitud"
        options={TIPOS_SOLICITUD}
        required
        value={tipo}
        onChange={setTipo}
      />
      {section === "analisis" && <AnalysisFields catalogos={catalogos} />}
      {section === "colaboracion" && (
        <FormField
          label="Tipo de colaboración"
          controlId="request-colaboracion"
          wide
        >
          <Select
            id="request-colaboracion"
            name="id_tipo_colaboracion"
            defaultValue=""
          >
            <option value="">Selecciona un tipo</option>
            {catalogos.tiposColaboracion.map(({ clave, nombre }) => (
              <option
                key={clave}
                value={clave}
              >
                {nombre}
              </option>
            ))}
          </Select>
        </FormField>
      )}
      {DESCRIPTION_LABELS[section] && (
        <FormField
          label={DESCRIPTION_LABELS[section]}
          controlId="request-descripcion"
          required
          wide
        >
          <TextArea
            key={section}
            id="request-descripcion"
            name="descripcion"
            required
            {...RULES.descripcion}
          />
        </FormField>
      )}
    </FormSection>
  );
};

export default RequestDetailsFields;
