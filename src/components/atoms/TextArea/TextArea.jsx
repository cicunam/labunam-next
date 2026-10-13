import styles from "./TextArea.module.css";
export function TextArea({ className = "", rows = 4, ...props }) {
    return <textarea {...props} rows={rows} className={`${styles.campo} ${className}`}/>;
}
