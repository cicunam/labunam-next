import styles from "./Tab.module.css";

const Tab = ({ id, panelId, seleccionada, className = "", ...props }) => {
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
};

export default Tab;
