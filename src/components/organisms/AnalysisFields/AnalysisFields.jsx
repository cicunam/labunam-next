"use client";

// LabUNAM
// Organismos
// AnalysisFields (campos de una solicitud de análisis o prueba)
// Ángelo M

// Dependencias
import { useState } from "react";
import {
  CERTIFICACIONES,
  RULES,
  TIEMPOS_ESPERA,
  TIEMPO_CON_DIAS,
} from "@/lib/solicitudes/solicitudes";

// Componentes
import FormField from "../../molecules/FormField/FormField";
import ChoiceGroup from "../../molecules/ChoiceGroup/ChoiceGroup";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";
import TextArea from "../../atoms/TextArea/TextArea";

// Definición del componente
const AnalysisFields = ({
  catalogos, // Object - Catálogos públicos: tiposMuestra
}) => {
  // Referencias y estado
  const [tiempo, setTiempo] = useState("");

  // Interfaz
  return (
    <>
      <FormField
        label="Descripción del análisis o prueba"
        controlId="request-descripcion"
        required
        wide
      >
        <TextArea
          id="request-descripcion"
          name="descripcion"
          required
          data-rule="descripcion"
        />
      </FormField>
      <FormField
        label="Tipo de muestra"
        controlId="request-muestra"
      >
        <Select
          id="request-muestra"
          name="id_tipo_muestra"
          defaultValue=""
        >
          <option value="">Selecciona un tipo</option>
          {catalogos.tiposMuestra.map(({ clave, nombre }) => (
            <option
              key={clave}
              value={clave}
            >
              {nombre}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField
        label="Norma o lineamiento por aplicar"
        controlId="request-norma"
      >
        <Input
          id="request-norma"
          name="norma_lineamiento"
          data-rule="norma"
        />
      </FormField>
      <FormField
        label="¿En cuánto tiempo necesitas el resultado?"
        controlId="request-tiempo"
      >
        <Select
          id="request-tiempo"
          name="id_tiempo_espera"
          value={tiempo}
          onChange={(event) => setTiempo(event.target.value)}
        >
          <option value="">Selecciona el tiempo</option>
          {TIEMPOS_ESPERA.map(({ id, label }) => (
            <option
              key={id}
              value={id}
            >
              {label}
            </option>
          ))}
        </Select>
      </FormField>
      {tiempo === TIEMPO_CON_DIAS && (
        <FormField
          label="Cantidad de días"
          controlId="request-dias"
          required
        >
          <Input
            id="request-dias"
            name="dias_respuesta"
            type="number"
            inputMode="numeric"
            required
            {...RULES.dias}
          />
        </FormField>
      )}
      <FormField
        label="Objetivos y productos esperados"
        controlId="request-objetivos"
        wide
      >
        <TextArea
          id="request-objetivos"
          name="objetivos"
          data-rule="descripcion"
        />
      </FormField>
      <ChoiceGroup
        legend="¿El laboratorio debe contar con alguno de estos requisitos?"
        name="certificado_requerido"
        options={CERTIFICACIONES}
      />
      <FormField
        label="Equipo específico que requieres"
        controlId="request-equipo"
        wide
      >
        <TextArea
          id="request-equipo"
          name="equipo_especifico"
          data-rule="descripcion"
        />
      </FormField>
    </>
  );
};

export default AnalysisFields;
