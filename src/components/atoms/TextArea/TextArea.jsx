import styles from "./TextArea.module.css";
const TextArea = ({ className = "", rows = 4, ...props }) => {
    return <textarea {...props} rows={rows} className={`${styles.campo} ${className}`}/>;
};

export default TextArea;
