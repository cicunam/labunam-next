import styles from "./Button.module.css";

const Button = ({ tamano = "mediano", className = "", type = "button", ...props }) => {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.boton} ${styles[tamano]} ${className}`}
    />
  );
};

export default Button;
