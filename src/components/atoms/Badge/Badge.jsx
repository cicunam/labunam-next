import styles from "./Badge.module.css";

const Badge = ({ tono = "neutro", className = "", ...props }) => {
  return (
    <span
      {...props}
      className={`${styles.insignia} ${styles[tono]} ${className}`}
    />
  );
};

export default Badge;
