import type { ReactNode } from "react";
import styles from "./SearchField.module.css";

export function SearchField({ etiqueta, controlId, ancho = false, children }: { etiqueta: string; controlId: string; ancho?: boolean; children: ReactNode }) {
  return (
    <div className={`${styles.segmento} ${ancho ? styles.ancho : ""}`}>
      <label className={styles.etiqueta} htmlFor={controlId}>{etiqueta}</label>
      <div className={styles.control}>{children}</div>
    </div>
  );
}
