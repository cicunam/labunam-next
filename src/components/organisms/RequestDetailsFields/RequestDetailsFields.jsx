"use client";
import { useState } from "react";
import FormSection from "../../molecules/FormSection/FormSection";
import FormField from "../../molecules/FormField/FormField";
import ChoiceGroup from "../../molecules/ChoiceGroup/ChoiceGroup";
import Select from "../../atoms/Select/Select";
import TextArea from "../../atoms/TextArea/TextArea";
import AnalysisFields from "../AnalysisFields/AnalysisFields";
import { REGLAS, TIPOS_SOLICITUD, sectionFor } from "@/lib/solicitudes/solicitudes";
// Cada tipo de solicitud guarda su texto principal en la misma columna `descripcion`.
const descripciones = {
    colaboracion: "Descripción de la colaboración",
    capacitacion: "Descripción de la capacitación",
    otra: "Especifica tu solicitud",
};
const RequestDetailsFields = ({ catalogos }) => {
    const [tipo, setTipo] = useState("");
    const seccion = sectionFor(TIPOS_SOLICITUD, tipo);
    return <FormSection titulo="Datos de la solicitud">
    <ChoiceGroup leyenda="Tipo de solicitud" nombre="id_tipo_solicitud" opciones={TIPOS_SOLICITUD} obligatorio valor={tipo} onChange={setTipo}/>
    {seccion === "analisis" && <AnalysisFields catalogos={catalogos}/>}
    {seccion === "colaboracion" && <FormField etiqueta="Tipo de colaboración" controlId="solicitud-colaboracion" ancho>
      <Select id="solicitud-colaboracion" name="id_tipo_colaboracion" defaultValue="">
        <option value="">Selecciona un tipo</option>
        {catalogos.tiposColaboracion.map(({ clave, nombre }) => <option key={clave} value={clave}>{nombre}</option>)}
      </Select>
    </FormField>}
    {descripciones[seccion] && <FormField etiqueta={descripciones[seccion]} controlId="solicitud-descripcion" obligatorio ancho>
      <TextArea key={seccion} id="solicitud-descripcion" name="descripcion" required {...REGLAS.descripcion}/>
    </FormField>}
  </FormSection>;
};

export default RequestDetailsFields;
