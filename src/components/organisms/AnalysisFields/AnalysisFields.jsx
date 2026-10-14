"use client";
import { useState } from "react";
import FormField from "../../molecules/FormField/FormField";
import ChoiceGroup from "../../molecules/ChoiceGroup/ChoiceGroup";
import Input from "../../atoms/Input/Input";
import Select from "../../atoms/Select/Select";
import TextArea from "../../atoms/TextArea/TextArea";
import { CERTIFICACIONES, REGLAS, TIEMPOS_ESPERA, TIEMPO_CON_DIAS } from "@/lib/solicitudes/solicitudes";
const AnalysisFields = ({ catalogos }) => {
    const [tiempo, setTiempo] = useState("");
    return <>
    <FormField etiqueta="Descripción del análisis o prueba" controlId="solicitud-descripcion" obligatorio ancho>
      <TextArea id="solicitud-descripcion" name="descripcion" required {...REGLAS.descripcion}/>
    </FormField>
    <FormField etiqueta="Tipo de muestra" controlId="solicitud-muestra">
      <Select id="solicitud-muestra" name="id_tipo_muestra" defaultValue="">
        <option value="">Selecciona un tipo</option>
        {catalogos.tiposMuestra.map(({ clave, nombre }) => <option key={clave} value={clave}>{nombre}</option>)}
      </Select>
    </FormField>
    <FormField etiqueta="Norma o lineamiento por aplicar" controlId="solicitud-norma">
      <Input id="solicitud-norma" name="norma_lineamiento" {...REGLAS.norma}/>
    </FormField>
    <FormField etiqueta="¿En cuánto tiempo necesitas el resultado?" controlId="solicitud-tiempo">
      <Select id="solicitud-tiempo" name="id_tiempo_espera" value={tiempo} onChange={(event) => setTiempo(event.target.value)}>
        <option value="">Selecciona el tiempo</option>
        {TIEMPOS_ESPERA.map(({ id, texto }) => <option key={id} value={id}>{texto}</option>)}
      </Select>
    </FormField>
    {tiempo === TIEMPO_CON_DIAS && <FormField etiqueta="Cantidad de días" controlId="solicitud-dias" obligatorio>
      <Input id="solicitud-dias" name="dias_respuesta" type="number" inputMode="numeric" required {...REGLAS.dias}/>
    </FormField>}
    <FormField etiqueta="Objetivos y productos esperados" controlId="solicitud-objetivos" ancho>
      <TextArea id="solicitud-objetivos" name="objetivos" {...REGLAS.descripcion}/>
    </FormField>
    <ChoiceGroup leyenda="¿El laboratorio debe contar con alguno de estos requisitos?" nombre="certificado_requerido" opciones={CERTIFICACIONES}/>
    <FormField etiqueta="Equipo específico que requieres" controlId="solicitud-equipo" ancho>
      <TextArea id="solicitud-equipo" name="equipo_especifico" {...REGLAS.descripcion}/>
    </FormField>
  </>;
};

export default AnalysisFields;
