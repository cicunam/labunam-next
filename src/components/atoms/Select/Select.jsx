import styles from "./Select.module.css";
export function Select({ className = "", children, ...props }) {
    return <select {...props} className={`${styles.campo} ${className}`}>{children}</select>;
}
