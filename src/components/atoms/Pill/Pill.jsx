import styles from "./Pill.module.css";

const Pill = ({ active = false, className = "", ...props }) => {
  return (
    <span
      {...props}
      data-active={active || undefined}
      className={`${styles.pill} ${className}`}
    />
  );
};

export default Pill;
