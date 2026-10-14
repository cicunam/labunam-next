"use client";

// LabUNAM
// Organismos
// LaboratoryDialog (ficha de laboratorio en modal o como página)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { lazy, Suspense } from "react";
import { fetchLaboratorioDetails } from "@/lib/ficha/ficha";

// Mecanismos
import { useLaboratoryDialog } from "./useLaboratoryDialog";

// Componentes
import Icon from "../../atoms/Icon/Icon";

// Estilos
import styles from "./LaboratoryDialog.module.css";

// La ficha se carga sólo cuando se abre el modal; no forma parte del JavaScript inicial.
const LaboratoryDetails = lazy(() => import("../LaboratoryDetails/LaboratoryDetails"));

// Definición del componente
// Sin initialLaboratorio es un modal que se abre al pulsar cualquier elemento con data-details
// (el contrato está en useLaboratoryDialog); con él se dibuja como página completa.
const LaboratoryDialog = ({
  loadDetails = fetchLaboratorioDetails, // Function Optional - Recibe el id (Number) y devuelve una promesa con la ficha; por defecto consulta /api/laboratorios/[id]
  initialLaboratorio = null, // Object Optional - Ficha ya cargada por la página /laboratorios/[id], con la forma que devuelve getById
}) => {
  // Mecanismos
  const { lab, error, dialog, closeDialog, handleBackdropClick, handleClose } = useLaboratoryDialog(
    { loadDetails, initialLaboratorio },
  );

  // Interfaz
  const details = !lab ? (
    <div className={styles.status}>
      <h2 id="details-title">Ficha del laboratorio</h2>
      <p role={error ? "alert" : "status"}>{error || "Cargando…"}</p>
    </div>
  ) : (
    <Suspense
      fallback={
        <p
          id="details-title"
          role="status"
        >
          Cargando ficha…
        </p>
      }
    >
      <LaboratoryDetails
        key={lab.idLab}
        laboratorio={lab}
        isPage={Boolean(initialLaboratorio)}
      />
    </Suspense>
  );

  if (initialLaboratorio) {
    return (
      <article
        className={styles.page}
        aria-labelledby="details-title"
      >
        {details}
      </article>
    );
  }
  return (
    <dialog
      ref={dialog}
      className={styles.details}
      aria-labelledby="details-title"
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        className={styles["details-close"]}
        aria-label="Cerrar ficha"
        onClick={closeDialog}
      >
        <Icon
          name="close"
          size={16}
        />
      </button>
      {details}
    </dialog>
  );
};

export default LaboratoryDialog;
