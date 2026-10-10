import styles from "./Badge.module.css";

const Badge = ({ tone = "neutral", className = "", ...props }) => {
  return (
    <span
      {...props}
      className={`${styles.badge} ${styles[tone]} ${className}`}
    />
  );
};

export default Badge;
