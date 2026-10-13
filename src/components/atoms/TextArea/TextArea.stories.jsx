import { TextArea } from "./TextArea";
const meta = {
    title: "Átomos/TextArea",
    component: TextArea,
    args: { id: "texto-ejemplo", placeholder: "Describe lo que necesitas" },
    decorators: [(Story) => <div style={{ width: "min(360px, 90vw)" }}><label htmlFor="texto-ejemplo">Descripción</label><Story /></div>],
};
export default meta;
export const Vacio = {};
export const ConValor = { args: { defaultValue: "Análisis de una muestra de ejemplo." } };
export const Deshabilitado = { args: { disabled: true } };
