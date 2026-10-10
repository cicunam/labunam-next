import styles from "./Tab.module.css";

const Tab = ({ id, panelId, selected, className = "", ...props }) => {
  return (
    <button
      {...props}
      id={id}
      type="button"
      role="tab"
      aria-controls={panelId}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={`${styles.tab} ${className}`}
    />
  );
};

export default Tab;
