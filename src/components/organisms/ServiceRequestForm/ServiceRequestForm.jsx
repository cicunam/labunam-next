"use client";

// LabUNAM
// Organismos
// ServiceRequestForm (formulario de solicitud de servicio; todavía no envía datos)
// Ángelo M

// Dependencias
import { useState } from "react";
import { RULES, textError } from "@/lib/solicitudes/solicitudes";

// Componentes
import Button from "../../atoms/Button/Button";
import RequesterFields from "../RequesterFields/RequesterFields";
import OrganizationFields from "../OrganizationFields/OrganizationFields";
import RequestDetailsFields from "../RequestDetailsFields/RequestDetailsFields";
import PrivacyNotice from "../PrivacyNotice/PrivacyNotice";

// Estilos
import styles from "./ServiceRequestForm.module.css";

// Definición del componente
// Mientras no exista el backend, el envío sólo confirma que el navegador aceptó los campos.
const ServiceRequestForm = ({
  laboratorio = null, // Object Optional - Laboratorio inicial de ?laboratorio: idLab, nombre y entidad
  catalogos, // Object - Catálogos públicos: paises, estados, dependencias, cargos, tiposMuestra y tiposColaboracion
}) => {
  // Referencias y estado
  const [checked, setChecked] = useState(false);

  // Gestores de evento
  // Los campos con data-rule se revisan con textError, la misma función que usa el servidor,
  // para que ambos acepten y rechacen exactamente los mismos textos.
  function checkRule(
    element, // Element - Campo del formulario
  ) {
    const rule = RULES[element.dataset?.rule];
    if (!rule) {
      return;
    }
    element.setCustomValidity(textError(element.value, rule, element.tagName === "TEXTAREA") ?? "");
  }

  function handleInput(event) {
    checkRule(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // El autocompletado del navegador puede llenar campos sin disparar input: se revisan todos.
    const form = event.currentTarget;
    form.querySelectorAll("[data-rule]").forEach(checkRule);
    if (!form.reportValidity()) {
      return;
    }
    setChecked(true);
  }

  // Interfaz
  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onInput={handleInput}
      onChange={() => setChecked(false)}
      aria-describedby="request-notice"
    >
      <div
        id="request-notice"
        className={styles.notice}
      >
        <p>
          El envío de solicitudes aún no está disponible: puedes llenar el formulario, pero no se
          enviará ni guardará información.
        </p>
        <p>
          Los campos marcados con{" "}
          <span
            className={styles.mark}
            aria-hidden="true"
          >
            *
          </span>
          <span className={styles.hidden}>asterisco</span> son obligatorios.
        </p>
      </div>
      <RequesterFields />
      <OrganizationFields catalogos={catalogos} />
      <RequestDetailsFields
        laboratorio={laboratorio}
        catalogos={catalogos}
      />
      <div className={styles.actions}>
        <PrivacyNotice />
        <Button
          type="submit"
          size="large"
        >
          Enviar solicitud
        </Button>
        <p
          role="status"
          className={styles.status}
        >
          {checked
            ? "Los datos están completos. El envío se habilitará próximamente; no se envió información."
            : ""}
        </p>
      </div>
    </form>
  );
};

export default ServiceRequestForm;
