"use client";
import { useEffect, useState } from "react";
import { SuggestionField } from "../../molecules/SuggestionField/SuggestionField";
import { FormField } from "../../molecules/FormField/FormField";
import { Select } from "../../atoms/Select/Select";
import { findOption, isUnam } from "@/lib/solicitudes/solicitudes";
import { MINIMO_BUSQUEDA, fetchInstitutions } from "@/lib/instituciones/instituciones";
// Las instituciones son miles: se piden al servidor tras una pausa breve en la escritura.
export function InstitutionFields({ catalogos, buscarInstituciones = fetchInstitutions }) {
    const [textoInstitucion, setInstitucion] = useState("");
    const [textoDependencia, setDependencia] = useState("");
    const [sugerencias, setSugerencias] = useState({ texto: "", opciones: [] });
    useEffect(() => {
        const texto = textoInstitucion.trim();
        if (texto.length < MINIMO_BUSQUEDA)
            return;
        const control = new AbortController();
        const espera = setTimeout(() => {
            buscarInstituciones(texto, control.signal)
                .then((opciones) => setSugerencias({ texto, opciones }))
                .catch(() => { if (!control.signal.aborted) setSugerencias({ texto, opciones: [] }); });
        }, 250);
        return () => { clearTimeout(espera); control.abort(); };
    }, [textoInstitucion, buscarInstituciones]);
    const opciones = textoInstitucion.trim().length < MINIMO_BUSQUEDA ? [] : sugerencias.opciones.map((opcion) => ({ ...opcion, detalle: opcion.siglas }));
    const institucion = findOption(opciones, textoInstitucion);
    const dependencia = findOption(catalogos.dependencias, textoDependencia);
    const unam = isUnam(institucion?.nombre);
    return <>
    {/* Una institución que no está en el catálogo se conserva como texto libre, igual que en la versión anterior. */}
    <SuggestionField etiqueta="Institución" controlId="solicitud-institucion" opciones={opciones} valor={textoInstitucion} onChange={(texto) => { setInstitucion(texto); setDependencia(""); }} obligatorio ancho placeholder="Escribe al menos dos letras" ayuda="Elige una sugerencia; si no aparece, escribe su nombre completo."/>
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
