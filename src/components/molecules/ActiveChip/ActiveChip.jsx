import { AppLink } from "../../atoms/AppLink/AppLink";
import { Icon } from "../../atoms/Icon/Icon";
import styles from "./ActiveChip.module.css";
export function ActiveChip({ href, etiqueta, valor }) {
    return (<AppLink href={href} className={styles.chip} aria-label={`Quitar ${etiqueta}: ${valor}`}>
      {valor}
      <Icon nombre="cerrar" tamano={12}/>
    </AppLink>);
}
