import styles from "./SearchField.module.css";

const SearchField = ({ label, controlId, wide = false, children }) => {
  return (
    <div className={`${styles.segment} ${wide ? styles.width : ""}`}>
      <label
        className={styles.label}
        htmlFor={controlId}
      >
        {label}
      </label>
      <div className={styles.control}>{children}</div>
    </div>
  );
};

export default SearchField;
