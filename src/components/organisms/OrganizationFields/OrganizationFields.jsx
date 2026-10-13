"use client";
import { useState } from "react";
import { FormSection } from "../../molecules/FormSection/FormSection";
import { FormField } from "../../molecules/FormField/FormField";
import { SuggestionField } from "../../molecules/SuggestionField/SuggestionField";
import { ChoiceGroup } from "../../molecules/ChoiceGroup/ChoiceGroup";
import { Input } from "../../atoms/Input/Input";
import { Select } from "../../atoms/Select/Select";
import { InstitutionFields } from "../InstitutionFields/InstitutionFields";
import { REGLAS, TAMANOS_EMPRESA, TIPOS_SOLICITANTE, findOption, requiresState, sectionFor } from "@/lib/solicitudes/solicitudes";
export function OrganizationFields({ catalogos }) {
    const [textoPais, setPais] = useState("");
    const [textoEstado, setEstado] = useState("");
    const [tipo, setTipo] = useState("");
    const pais = findOption(catalogos.paises, textoPais);
    const estados = pais && requiresState(pais.clave) ? catalogos.estados[pais.clave] ?? [] : null;
    const estado = estados && findOption(estados, textoEstado);
    const seccion = sectionFor(TIPOS_SOLICITANTE, tipo);
    return <FormSection titulo="Datos de la organización">
    <SuggestionField etiqueta="País" controlId="solicitud-pais" opciones={catalogos.paises} valor={textoPais} onChange={(texto) => { setPais(texto); setEstado(""); }} obligatorio valido={!textoPais || Boolean(pais)} mensaje="Elige un país de la lista." placeholder="Escribe y elige un país"/>
    <input type="hidden" name="id_pais" value={pais?.clave ?? ""}/>
    {estados && <>
      <SuggestionField etiqueta="Estado" controlId="solicitud-estado" opciones={estados} valor={textoEstado} onChange={setEstado} valido={!textoEstado || Boolean(estado)} mensaje="Elige un estado de la lista o deja el campo vacío."/>
      <input type="hidden" name="id_estado" value={estado?.clave ?? ""}/>
    </>}
    <FormField etiqueta="Tipo de solicitante" controlId="solicitud-tipo-solicitante" obligatorio ancho>
      <Select id="solicitud-tipo-solicitante" name="id_tipo_solicitante" required value={tipo} onChange={(event) => setTipo(event.target.value)}>
        <option value="">Selecciona una opción</option>
        {TIPOS_SOLICITANTE.map(({ id, texto }) => <option key={id} value={id}>{texto}</option>)}
      </Select>
    </FormField>
    {seccion === "empresa" && <>
      <FormField etiqueta="Nombre de la empresa" controlId="solicitud-organizacion" obligatorio ancho>
        <Input id="solicitud-organizacion" name="organizacion" required autoComplete="organization" {...REGLAS.organizacion}/>
      </FormField>
      <ChoiceGroup leyenda="Tamaño de la empresa" nombre="tipo_empresa" opciones={TAMANOS_EMPRESA}/>
    </>}
    {seccion === "sociedad" && <FormField etiqueta="Nombre de la organización" controlId="solicitud-organizacion" obligatorio ancho>
      <Input id="solicitud-organizacion" name="organizacion" required autoComplete="organization" {...REGLAS.organizacion}/>
    </FormField>}
    {seccion === "institucion" && <InstitutionFields catalogos={catalogos}/>}
    {seccion === "otro" && <FormField etiqueta="Especifica el tipo de solicitante" controlId="solicitud-tipo-otro" obligatorio ancho>
      <Input id="solicitud-tipo-otro" name="tipo_solicitante_otro" required {...REGLAS.organizacion}/>
    </FormField>}
  </FormSection>;
}
