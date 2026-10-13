import { ChoiceGroup } from "./ChoiceGroup";
const meta = {
    title: "Moléculas/ChoiceGroup",
    component: ChoiceGroup,
    args: { leyenda: "Tipo de solicitud", nombre: "tipo-ejemplo", opciones: [{ id: "1", texto: "Primera opción" }, { id: "2", texto: "Segunda opción" }, { id: "3", texto: "Otra" }] },
    decorators: [(Story) => <div style={{ width: "min(480px, 90vw)" }}><Story /></div>],
};
export default meta;
export const Opcional = {};
export const Obligatorio = { args: { obligatorio: true } };
