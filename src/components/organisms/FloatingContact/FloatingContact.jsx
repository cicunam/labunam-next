// LabUNAM
// Organismos
// FloatingContact (botón flotante con el sobre que abre /contacto)
// Ángelo M

// Dependencias
import Link from "next/link";

// Estilos
import styles from "./FloatingContact.module.css";

// Definición del componente
// Acceso permanente a /contacto, que ya no aparece en la navegación principal.
const FloatingContact = () => {
  // Interfaz
  return (
    <Link
      href="/contacto"
      className={styles.button}
      aria-label="Contacto"
      title="Contacto"
    >
      <img
        src="/assets/icons/correo-blanco.png"
        width={47}
        height={31}
        alt=""
      />
    </Link>
  );
};

export default FloatingContact;
