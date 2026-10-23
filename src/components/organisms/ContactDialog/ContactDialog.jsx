"use client";

// LabUNAM
// Organismos
// ContactDialog (diálogo de contacto rápido; todavía no envía mensajes)
// Ángelo M

// Dependencias
import Link from "next/link";
import { useRef } from "react";
import { CONTACT_DIALOG_ID } from "@/lib/contacto/contacto";

// Componentes
import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";
import Input from "../../atoms/Input/Input";
import TextArea from "../../atoms/TextArea/TextArea";
import FormField from "../../molecules/FormField/FormField";

// Estilos
import styles from "./ContactDialog.module.css";

// Definición del componente
// Mientras no haya un buzón acordado para mensajes generales, los campos se muestran deshabilitados.
const ContactDialog = () => {
  // Referencias y estado
  const dialog = useRef(null);

  // Gestores de evento
  function closeDialog() {
    dialog.current?.close();
  }

  // Un clic fuera del contenido (sobre el fondo) cierra el diálogo, como en el de filtros.
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  // Interfaz
  return (
    <dialog
      ref={dialog}
      id={CONTACT_DIALOG_ID}
      className={styles.modal}
      aria-labelledby="contact-title"
      onClick={handleBackdropClick}
    >
      <header className={styles.header}>
        <h2
          id="contact-title"
          className={styles.title}
        >
          Contacto
        </h2>
        <button
          type="button"
          className={styles.close}
          aria-label="Cerrar contacto"
          onClick={closeDialog}
        >
          <Icon
            name="close"
            size={16}
          />
        </button>
      </header>
      <div className={styles.body}>
        <p
          id="contact-notice"
          className={styles.notice}
        >
          El envío de mensajes aún no está disponible. Mientras tanto, puedes consultar los canales
          de contacto en el{" "}
          <a
            href="https://www.cic.unam.mx/"
            target="_blank"
            rel="noopener"
          >
            sitio de la CIC<span aria-hidden="true"> ↗</span>
            <span className={styles.hidden}> (se abre en una pestaña nueva)</span>
          </a>
          .
        </p>
        <fieldset
          className={styles.fields}
          disabled
          aria-describedby="contact-notice"
        >
          <legend className={styles.hidden}>Datos del mensaje</legend>
          <FormField
            label="Nombre"
            controlId="contact-name"
          >
            <Input
              id="contact-name"
              autoComplete="name"
            />
          </FormField>
          <FormField
            label="Correo electrónico"
            controlId="contact-email"
          >
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
            />
          </FormField>
          <FormField
            label="Mensaje"
            controlId="contact-message"
          >
            <TextArea id="contact-message" />
          </FormField>
          <Button disabled>Envío no disponible</Button>
        </fieldset>
        <p className={styles.request}>
          Si quieres enviar una solicitud de servicio, hazlo en el siguiente enlace:{" "}
          <Link
            href="/solicitud"
            onClick={closeDialog}
          >
            Haz una solicitud →
          </Link>
        </p>
      </div>
    </dialog>
  );
};

export default ContactDialog;
