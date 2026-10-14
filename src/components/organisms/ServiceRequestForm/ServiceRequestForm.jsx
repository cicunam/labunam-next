"use client";

// LabUNAM
// Organismos
// ServiceRequestForm (formulario de solicitud de servicio; todavía no envía datos)
// Ángelo M

// Dependencias
import { useState } from "react";

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
  laboratorio = null, // Object Optional - Laboratorio asociado: idLab
  catalogos, // Object - Catálogos públicos: paises, estados, dependencias, cargos, tiposMuestra y tiposColaboracion
}) => {
  // Referencias y estado
  const [checked, setChecked] = useState(false);

  // Gestores de evento
  function handleSubmit(event) {
    event.preventDefault();
    setChecked(true);
  }

  // Interfaz
  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
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
      {laboratorio && (
        <input
          type="hidden"
          name="id_laboratorio"
          value={laboratorio.idLab}
        />
      )}
      <RequesterFields />
      <OrganizationFields catalogos={catalogos} />
      <RequestDetailsFields catalogos={catalogos} />
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
