import { Select } from "./Select";
const meta = {
    title: "Átomos/Select",
    component: Select,
    args: { id: "selector-ejemplo", children: <><option value="">Selecciona una opción</option><option value="1">Primera opción</option><option value="2">Segunda opción</option></> },
    decorators: [(Story) => <div style={{ width: "min(300px, 80vw)" }}><label htmlFor="selector-ejemplo">Tipo</label><Story /></div>],
};
export default meta;
export const Vacio = {};
export const ConValor = { args: { defaultValue: "2" } };
export const Deshabilitado = { args: { disabled: true } };
