"use client";
import { useState } from "react";
import { Button } from "../../atoms/Button/Button";
import { RequesterFields } from "../RequesterFields/RequesterFields";
import { OrganizationFields } from "../OrganizationFields/OrganizationFields";
import { RequestDetailsFields } from "../RequestDetailsFields/RequestDetailsFields";
import styles from "./ServiceRequestForm.module.css";
// Mientras no exista el backend, el envío sólo confirma que el navegador aceptó los campos.
export function ServiceRequestForm({ laboratorio = null, catalogos }) {
    const [revisado, setRevisado] = useState(false);
    function handleSubmit(event) {
        event.preventDefault();
        setRevisado(true);
    }
    return <form className={styles.formulario} onSubmit={handleSubmit} onChange={() => setRevisado(false)} aria-describedby="solicitud-aviso">
    <div id="solicitud-aviso" className={styles.aviso}>
      <p>El envío de solicitudes aún no está disponible: puedes llenar el formulario, pero no se enviará ni guardará información.</p>
      <p>Los campos marcados con <span className={styles.marca} aria-hidden="true">*</span><span className={styles.oculto}>asterisco</span> son obligatorios.</p>
    </div>
    {laboratorio && <input type="hidden" name="id_laboratorio" value={laboratorio.idLab}/>}
    <RequesterFields />
    <OrganizationFields catalogos={catalogos}/>
    <RequestDetailsFields catalogos={catalogos}/>
    <div className={styles.acciones}>
      <Button type="submit" tamano="grande">Enviar solicitud</Button>
      <p role="status" className={styles.estado}>{revisado ? "Los datos están completos. El envío se habilitará próximamente; no se envió información." : ""}</p>
    </div>
  </form>;
}
