"use client";

// LabUNAM
// Organismos
// FloatingContact (botón flotante con el sobre que abre el diálogo de contacto)
// Ángelo M

// Dependencias
import { usePathname } from "next/navigation";
import { CONTACT_DIALOG_ID, openContactDialog } from "@/lib/contacto/contacto";

// Estilos
import styles from "./FloatingContact.module.css";

// Definición del componente
// En /solicitud no se muestra: a media altura tapaba los campos del formulario en móvil, y esa
// página ya ofrece el mismo diálogo desde su columna de orientación.
const FloatingContact = () => {
  // Preparación de datos
  const pathname = usePathname();
  if (pathname === "/solicitud") {
    return null;
  }

  // Interfaz
  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Contacto"
      title="Contacto"
      aria-haspopup="dialog"
      aria-controls={CONTACT_DIALOG_ID}
      onClick={openContactDialog}
    >
      <img
        src="/assets/icons/correo-blanco.png"
        width={47}
        height={31}
        alt=""
      />
    </button>
  );
};

export default FloatingContact;
