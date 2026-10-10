import AppLink from "../../atoms/AppLink/AppLink";
import Icon from "../../atoms/Icon/Icon";
import styles from "./ActiveChip.module.css";

const ActiveChip = ({ href, label, value }) => {
  return (
    <AppLink
      href={href}
      className={styles.chip}
      aria-label={`Quitar ${label}: ${value}`}
    >
      {value}
      <Icon
        name="close"
        size={12}
      />
    </AppLink>
  );
};

export default ActiveChip;
