import type { ButtonHTMLAttributes } from "react";
import styles from "./Pestana.module.css";

export function Pestana({ id, panelId, seleccionada, className = "", ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id"> & { id: string; panelId: string; seleccionada: boolean }) {
  return (
    <button
      {...props}
      id={id}
      type="button"
      role="tab"
      aria-controls={panelId}
      aria-selected={seleccionada}
      tabIndex={seleccionada ? 0 : -1}
      className={`${styles.pestana} ${className}`}
    />
  );
}
