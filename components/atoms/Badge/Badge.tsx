import type { HTMLAttributes } from "react";
import styles from "./Badge.module.css";

export function Badge({ tono = "neutro", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { tono?: "rojo" | "azul" | "verde" | "neutro" }) {
  return <span {...props} className={`${styles.insignia} ${styles[tono]} ${className}`} />;
}
