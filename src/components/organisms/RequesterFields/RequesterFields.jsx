import { FormSection } from "../../molecules/FormSection/FormSection";
import { FormField } from "../../molecules/FormField/FormField";
import { Input } from "../../atoms/Input/Input";
import { REGLAS } from "@/lib/solicitudes/solicitudes";
export function RequesterFields() {
    return <FormSection titulo="Datos de contacto">
    <FormField etiqueta="Nombre(s)" controlId="solicitud-nombre" obligatorio ancho>
      <Input id="solicitud-nombre" name="nombre" required autoComplete="given-name" {...REGLAS.nombre}/>
    </FormField>
    <FormField etiqueta="Primer apellido" controlId="solicitud-apellido1" obligatorio>
      <Input id="solicitud-apellido1" name="apellido1" required autoComplete="family-name" {...REGLAS.nombre}/>
    </FormField>
    <FormField etiqueta="Segundo apellido" controlId="solicitud-apellido2">
      <Input id="solicitud-apellido2" name="apellido2" autoComplete="off" {...REGLAS.nombre}/>
    </FormField>
    <FormField etiqueta="Correo electrónico" controlId="solicitud-correo" obligatorio ayuda="Te enviaremos un código para confirmarlo antes de registrar la solicitud.">
      <Input id="solicitud-correo" name="correo" type="email" required autoComplete="email" placeholder="nombre@ejemplo.com" aria-describedby="solicitud-correo-ayuda" {...REGLAS.correo}/>
    </FormField>
    <FormField etiqueta="Teléfono" controlId="solicitud-telefono" obligatorio ayuda="Sólo números, entre 8 y 13 dígitos.">
      <Input id="solicitud-telefono" name="telefono" type="tel" inputMode="numeric" required autoComplete="tel" aria-describedby="solicitud-telefono-ayuda" {...REGLAS.telefono}/>
    </FormField>
  </FormSection>;
}
