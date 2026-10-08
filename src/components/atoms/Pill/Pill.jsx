import styles from "./Pill.module.css";
export function Pill({ activa = false, className = "", ...props }) {
    return <span {...props} data-activa={activa || undefined} className={`${styles.pildora} ${className}`}/>;
}
