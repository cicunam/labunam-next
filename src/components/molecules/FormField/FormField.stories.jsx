import { FormField } from "./FormField";
import { Input } from "../../atoms/Input/Input";
const meta = {
    title: "Moléculas/FormField",
    component: FormField,
    args: { etiqueta: "Nombre", controlId: "campo-nombre", children: <Input id="campo-nombre"/> },
    decorators: [(Story) => <div style={{ width: "min(360px, 90vw)" }}><Story /></div>],
};
export default meta;
export const Opcional = {};
export const Obligatorio = { args: { obligatorio: true, children: <Input id="campo-nombre" required/> } };
export const ConAyuda = { args: { etiqueta: "Teléfono", controlId: "campo-telefono", ayuda: "Sólo números, entre 8 y 13 dígitos.", children: <Input id="campo-telefono" aria-describedby="campo-telefono-ayuda"/> } };
