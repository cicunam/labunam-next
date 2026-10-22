// LabUNAM
// Organismos
// RequesterFields (datos de contacto de quien hace la solicitud)
// Ángelo M

// Componentes
import FormSection from "../../molecules/FormSection/FormSection";
import FormField from "../../molecules/FormField/FormField";
import Input from "../../atoms/Input/Input";

// Definición del componente
// Sin estilos propios: la retícula y los campos vienen de FormSection y FormField.
const RequesterFields = () => {
  // Interfaz
  return (
    <FormSection title="Datos de contacto">
      <FormField
        label="Nombre(s)"
        controlId="request-nombre"
        required
        wide
      >
        <Input
          id="request-nombre"
          name="nombre"
          required
          autoComplete="given-name"
          data-rule="nombre"
        />
      </FormField>
      <FormField
        label="Primer apellido"
        controlId="request-apellido1"
        required
      >
        <Input
          id="request-apellido1"
          name="apellido1"
          required
          autoComplete="family-name"
          data-rule="nombre"
        />
      </FormField>
      <FormField
        label="Segundo apellido"
        controlId="request-apellido2"
      >
        <Input
          id="request-apellido2"
          name="apellido2"
          autoComplete="off"
          data-rule="nombre"
        />
      </FormField>
      <FormField
        label="Correo electrónico"
        controlId="request-correo"
        required
        hint="Te enviaremos un código para confirmarlo antes de registrar la solicitud."
      >
        <Input
          id="request-correo"
          name="correo"
          type="email"
          required
          autoComplete="email"
          placeholder="nombre@ejemplo.com"
          aria-describedby="request-correo-hint"
          data-rule="correo"
        />
      </FormField>
      <FormField
        label="Teléfono"
        controlId="request-telefono"
        required
        hint="Sólo números, entre 8 y 13 dígitos."
      >
        <Input
          id="request-telefono"
          name="telefono"
          type="tel"
          inputMode="numeric"
          required
          autoComplete="tel"
          aria-describedby="request-telefono-hint"
          data-rule="telefono"
        />
      </FormField>
    </FormSection>
  );
};

export default RequesterFields;
