import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export function Button({ tamano = "mediano", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tamano?: "pequeno" | "mediano" | "grande" }) {
  return <button {...props} type={type} className={`${styles.boton} ${styles[tamano]} ${className}`} />;
}
