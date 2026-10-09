import Link from "next/link";
import styles from "./FloatingContact.module.css";
// Acceso permanente a /contacto, que ya no aparece en la navegación principal.
export function FloatingContact() {
    return <Link href="/contacto" className={styles.sobre} aria-label="Contacto" title="Contacto">
    <img src="/assets/icons/correo-blanco.png" width={47} height={31} alt=""/>
  </Link>;
}
