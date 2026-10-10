import styles from "./Badge.module.css";

export function Badge({ tono = "neutro", className = "", ...props }) {
  return (
    <span
      {...props}
      className={`${styles.insignia} ${styles[tono]} ${className}`}
    />
  );
}
