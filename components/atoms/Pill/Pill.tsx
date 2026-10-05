import type { HTMLAttributes } from "react";
import styles from "./Pill.module.css";

export function Pill({ activa = false, className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { activa?: boolean }) {
  return <span {...props} data-activa={activa || undefined} className={`${styles.pildora} ${className}`} />;
}
