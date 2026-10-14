import styles from "./Select.module.css";
const Select = ({ className = "", children, ...props }) => {
    return <select {...props} className={`${styles.campo} ${className}`}>{children}</select>;
};

export default Select;
