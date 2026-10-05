import type { ChangeEventHandler } from "react";
import styles from "./FilterOption.module.css";

export function FilterOption({ nombre, valor, etiqueta, total, seleccionada, onChange }: { nombre: string; valor: string; etiqueta: string; total?: number; seleccionada: boolean; onChange: ChangeEventHandler<HTMLInputElement> }) {
  const deshabilitada = total === 0 && !seleccionada;
  return (
    <label className={styles.opcion} data-vacia={deshabilitada || undefined}>
      <input type="radio" name={nombre} value={valor} checked={seleccionada} disabled={deshabilitada} onChange={onChange} />
      <span>{etiqueta}</span>
      {total !== undefined && <span className={styles.cuenta} aria-label={`${total} resultados`}>{total}</span>}
    </label>
  );
}
