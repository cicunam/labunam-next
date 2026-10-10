import styles from "./SearchField.module.css";

const SearchField = ({ etiqueta, controlId, ancho = false, children }) => {
  return (
    <div className={`${styles.segmento} ${ancho ? styles.ancho : ""}`}>
      <label
        className={styles.etiqueta}
        htmlFor={controlId}
      >
        {etiqueta}
      </label>
      <div className={styles.control}>{children}</div>
    </div>
  );
};

export default SearchField;
