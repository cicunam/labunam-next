import type { InputHTMLAttributes } from "react";
import styles from "./Campo.module.css";

export function Campo({ integrado = false, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { integrado?: boolean }) {
  return <input {...props} className={`${styles.campo} ${integrado ? styles.integrado : ""} ${className}`} />;
}
