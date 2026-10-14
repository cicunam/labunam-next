import styles from "./ChoiceGroup.module.css";
const ChoiceGroup = ({ leyenda, nombre, opciones = [], obligatorio = false, valor, onChange, ancho = true }) => {
    return <fieldset className={`${styles.grupo} ${ancho ? styles.ancho : ""}`}>
    <legend className={styles.leyenda}>{leyenda}{obligatorio && <span className={styles.marca} aria-hidden="true"> *</span>}</legend>
    <div className={styles.opciones}>
      {opciones.map(({ id, texto }) => <label key={id} className={styles.opcion}>
          <input type="radio" name={nombre} value={id} required={obligatorio} checked={valor === undefined ? undefined : valor === id} onChange={onChange && (() => onChange(id))}/>
          {texto}
        </label>)}
    </div>
  </fieldset>;
};

export default ChoiceGroup;
