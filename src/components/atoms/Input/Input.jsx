import styles from "./Input.module.css";

const Input = ({ integrado = false, className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`${styles.campo} ${integrado ? styles.integrado : ""} ${className}`}
    />
  );
};

export default Input;
