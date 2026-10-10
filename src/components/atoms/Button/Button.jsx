import styles from "./Button.module.css";

export function Button({ tamano = "mediano", className = "", type = "button", ...props }) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.boton} ${styles[tamano]} ${className}`}
    />
  );
}
