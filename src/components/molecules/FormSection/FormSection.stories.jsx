import { FormSection } from "./FormSection";
import { FormField } from "../FormField/FormField";
import { Input } from "../../atoms/Input/Input";
const meta = {
    title: "Moléculas/FormSection",
    component: FormSection,
    args: {
        titulo: "Datos de contacto",
        children: <>
          <FormField etiqueta="Nombre" controlId="seccion-nombre" ancho><Input id="seccion-nombre"/></FormField>
          <FormField etiqueta="Correo electrónico" controlId="seccion-correo"><Input id="seccion-correo" type="email"/></FormField>
          <FormField etiqueta="Teléfono" controlId="seccion-telefono"><Input id="seccion-telefono" type="tel"/></FormField>
        </>,
    },
    decorators: [(Story) => <div style={{ width: "min(720px, 92vw)" }}><Story /></div>],
};
export default meta;
export const Principal = {};
