import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

export function Input({ integrado = false, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { integrado?: boolean }) {
  return <input {...props} className={`${styles.campo} ${integrado ? styles.integrado : ""} ${className}`} />;
}
