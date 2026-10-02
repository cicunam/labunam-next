import type { ButtonHTMLAttributes } from "react";
import styles from "./Boton.module.css";

export function Boton({ tamano = "mediano", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tamano?: "pequeno" | "mediano" | "grande" }) {
  return <button {...props} type={type} className={`${styles.boton} ${styles[tamano]} ${className}`} />;
}
