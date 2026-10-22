"use client";

// LabUNAM
// Organismos
// ContactLink (botón con aspecto de enlace que abre el diálogo de contacto)
// Ángelo M

// Dependencias
import { CONTACT_DIALOG_ID, openContactDialog } from "@/lib/contacto/contacto";

// Estilos
import styles from "./ContactLink.module.css";

// Definición del componente
// Es un botón y no un enlace porque abre un diálogo en lugar de navegar.
const ContactLink = ({
  children, // ReactNode - Texto visible del botón
}) => {
  // Interfaz
  return (
    <button
      type="button"
      className={styles.link}
      aria-haspopup="dialog"
      aria-controls={CONTACT_DIALOG_ID}
      onClick={openContactDialog}
    >
      {children}
    </button>
  );
};

export default ContactLink;
