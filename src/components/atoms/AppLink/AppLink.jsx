import Link from "next/link";
import styles from "./AppLink.module.css";

const AppLink = ({ href, className = "", ...props }) => {
  return (
    <Link
      {...props}
      href={href}
      className={`${styles.enlace} ${className}`}
    />
  );
};

export default AppLink;
