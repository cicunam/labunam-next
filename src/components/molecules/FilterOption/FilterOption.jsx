import styles from "./FilterOption.module.css";

const FilterOption = ({ name, value, label, total, selected, onChange }) => {
  const disabled = total === 0 && !selected;
  return (
    <label
      className={styles.option}
      data-empty={disabled || undefined}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={onChange}
      />

      <span>{label}</span>
      {total !== undefined && (
        <span
          className={styles.count}
          aria-label={`${total} resultados`}
        >
          {total}
        </span>
      )}
    </label>
  );
};

export default FilterOption;
