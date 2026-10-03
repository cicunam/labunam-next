import { Enlace } from "../atoms/Enlace";
import { Icono } from "../atoms/Icono";
import styles from "./ChipActivo.module.css";

export function ChipActivo({ href, etiqueta, valor }: { href: string; etiqueta: string; valor: string }) {
  return (
    <Enlace href={href} className={styles.chip} aria-label={`Quitar ${etiqueta}: ${valor}`}>
      {valor}
      <Icono nombre="cerrar" tamano={12} />
    </Enlace>
  );
}
