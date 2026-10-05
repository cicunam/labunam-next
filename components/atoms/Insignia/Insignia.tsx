import type { HTMLAttributes } from "react";
import styles from "./Insignia.module.css";

export function Insignia({ tono = "neutro", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { tono?: "rojo" | "azul" | "verde" | "neutro" }) {
  return <span {...props} className={`${styles.insignia} ${styles[tono]} ${className}`} />;
}
