"use client";
import { useState } from "react";
import { SuggestionField } from "../../molecules/SuggestionField/SuggestionField";
import { FormField } from "../../molecules/FormField/FormField";
import { Select } from "../../atoms/Select/Select";
import { findOption, isUnam } from "@/lib/solicitudes/solicitudes";
export function InstitutionFields({ catalogos }) {
    const [textoInstitucion, setInstitucion] = useState("");
    const [textoDependencia, setDependencia] = useState("");
    const institucion = findOption(catalogos.instituciones, textoInstitucion);
    const dependencia = findOption(catalogos.dependencias, textoDependencia);
    const unam = isUnam(institucion?.nombre);
    return <>
    {/* Una institución que no está en el catálogo se conserva como texto libre, igual que en la versión anterior. */}
    <SuggestionField etiqueta="Institución" controlId="solicitud-institucion" opciones={catalogos.instituciones} valor={textoInstitucion} onChange={(texto) => { setInstitucion(texto); setDependencia(""); }} obligatorio ancho ayuda="Si no aparece en la lista, escribe su nombre completo."/>
    <input type="hidden" name="id_institucion" value={institucion?.clave ?? ""}/>
    <input type="hidden" name="institucion_otra" value={institucion ? "" : textoInstitucion.trim()}/>
    {unam && <>
      <SuggestionField etiqueta="Dependencia" controlId="solicitud-dependencia" opciones={catalogos.dependencias} valor={textoDependencia} onChange={setDependencia} valido={!textoDependencia || Boolean(dependencia)} mensaje="Elige una dependencia de la lista o deja el campo vacío."/>
      <input type="hidden" name="id_dependencia" value={dependencia?.clave ?? ""}/>
    </>}
    <FormField etiqueta="Cargo" controlId="solicitud-cargo">
      <Select id="solicitud-cargo" name="id_cargo" defaultValue="">
        <option value="">Selecciona un cargo</option>
        {catalogos.cargos.map(({ clave, nombre }) => <option key={clave} value={clave}>{nombre}</option>)}
      </Select>
    </FormField>
  </>;
}
