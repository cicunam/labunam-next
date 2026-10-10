import styles from "./Input.module.css";

const Input = ({ integrated = false, className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`${styles.input} ${integrated ? styles.integrated : ""} ${className}`}
    />
  );
};

export default Input;
