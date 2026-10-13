import { useState } from "react";
import { SuggestionField } from "./SuggestionField";
const opciones = [{ clave: "1", nombre: "Primera opción" }, { clave: "2", nombre: "Segunda opción" }];
function Ejemplo(args) {
    const [valor, setValor] = useState(args.valor ?? "");
    return <SuggestionField {...args} valor={valor} onChange={setValor} valido={!valor || opciones.some((opcion) => opcion.nombre === valor)}/>;
}
const meta = {
    title: "Moléculas/SuggestionField",
    component: SuggestionField,
    args: { etiqueta: "País", controlId: "sugerencia-ejemplo", opciones, placeholder: "Escribe y elige una opción" },
    render: (args) => <Ejemplo {...args}/>,
    decorators: [(Story) => <div style={{ width: "min(360px, 90vw)" }}><Story /></div>],
};
export default meta;
export const Vacio = {};
export const Obligatorio = { args: { obligatorio: true } };
export const ConAyuda = { args: { ayuda: "Si no aparece en la lista, escríbelo completo." } };
