import styles from "./Button.module.css";

const Button = ({ size = "medium", className = "", type = "button", ...props }) => {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${styles[size]} ${className}`}
    />
  );
};

export default Button;
