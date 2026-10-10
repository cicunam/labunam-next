import styles from "./Pill.module.css";

const Pill = ({ activa = false, className = "", ...props }) => {
  return (
    <span
      {...props}
      data-activa={activa || undefined}
      className={`${styles.pildora} ${className}`}
    />
  );
};

export default Pill;
