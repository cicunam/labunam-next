"use client";

// LabUNAM
// Organismos
// OrganizationFields (país, estado y tipo de solicitante con sus campos adicionales)
// Ángelo M

// Dependencias
import { useState } from "react";
import {
  RULES,
  TAMANOS_EMPRESA,
  TIPOS_SOLICITANTE,
  findOption,
  requiresState,
  sectionFor,
} from "@/lib/solicitudes/solicitudes";

// Componentes
import FormSection from "../../molecules/FormSection/FormSection";
import FormField from "../../molecules/FormField/FormField";
import SuggestionField from "../../molecules/SuggestionField/SuggestionField";
import ChoiceGroup from "../../molecules/ChoiceGroup/ChoiceGroup";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";
import InstitutionFields from "../InstitutionFields/InstitutionFields";

// Definición del componente
// Sin estilos propios: la retícula y los campos vienen de FormSection y FormField.
const OrganizationFields = ({
  catalogos, // Object - Catálogos públicos: paises, estados (por clave de país), dependencias y cargos
}) => {
  // Referencias y estado
  const [paisText, setPaisText] = useState("");
  const [estadoText, setEstadoText] = useState("");
  const [tipo, setTipo] = useState("");

  // Preparación de datos
  // Las claves se derivan del texto escrito; los campos ocultos son los que viajan.
  const pais = findOption(catalogos.paises, paisText);
  const estados = pais && requiresState(pais.clave) ? (catalogos.estados[pais.clave] ?? []) : null;
  const estado = estados && findOption(estados, estadoText);
  const section = sectionFor(TIPOS_SOLICITANTE, tipo);

  // Interfaz
  return (
    <FormSection title="Datos de la organización">
      <SuggestionField
        label="País"
        controlId="request-pais"
        options={catalogos.paises}
        value={paisText}
        onChange={(text) => {
          setPaisText(text);
          setEstadoText("");
        }}
        required
        valid={!paisText || Boolean(pais)}
        message="Elige un país de la lista."
        placeholder="Escribe y elige un país"
      />
      <input
        type="hidden"
        name="id_pais"
        value={pais?.clave ?? ""}
      />
      {estados && (
        <>
          <SuggestionField
            label="Estado"
            controlId="request-estado"
            options={estados}
            value={estadoText}
            onChange={setEstadoText}
            valid={!estadoText || Boolean(estado)}
            message="Elige un estado de la lista o deja el campo vacío."
          />
          <input
            type="hidden"
            name="id_estado"
            value={estado?.clave ?? ""}
          />
        </>
      )}
      <FormField
        label="Tipo de solicitante"
        controlId="request-tipo-solicitante"
        required
        wide
      >
        <Select
          id="request-tipo-solicitante"
          name="id_tipo_solicitante"
          required
          value={tipo}
          onChange={(event) => setTipo(event.target.value)}
        >
          <option value="">Selecciona una opción</option>
          {TIPOS_SOLICITANTE.map(({ id, label }) => (
            <option
              key={id}
              value={id}
            >
              {label}
            </option>
          ))}
        </Select>
      </FormField>
      {section === "empresa" && (
        <>
          <FormField
            label="Nombre de la empresa"
            controlId="request-organizacion"
            required
            wide
          >
            <Input
              id="request-organizacion"
              name="organizacion"
              required
              autoComplete="organization"
              {...RULES.organizacion}
            />
          </FormField>
          <ChoiceGroup
            legend="Tamaño de la empresa"
            name="tipo_empresa"
            options={TAMANOS_EMPRESA}
          />
        </>
      )}
      {section === "sociedad" && (
        <FormField
          label="Nombre de la organización"
          controlId="request-organizacion"
          required
          wide
        >
          <Input
            id="request-organizacion"
            name="organizacion"
            required
            autoComplete="organization"
            {...RULES.organizacion}
          />
        </FormField>
      )}
      {section === "institucion" && <InstitutionFields catalogos={catalogos} />}
      {section === "otro" && (
        <FormField
          label="Especifica el tipo de solicitante"
          controlId="request-tipo-otro"
          required
          wide
        >
          <Input
            id="request-tipo-otro"
            name="tipo_solicitante_otro"
            required
            {...RULES.organizacion}
          />
        </FormField>
      )}
    </FormSection>
  );
};

export default OrganizationFields;
