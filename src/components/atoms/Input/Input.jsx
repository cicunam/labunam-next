import styles from "./Input.module.css";
export function Input({ integrado = false, className = "", ...props }) {
    return <input {...props} className={`${styles.campo} ${integrado ? styles.integrado : ""} ${className}`}/>;
}
