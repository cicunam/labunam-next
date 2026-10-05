import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import styles from "./Enlace.module.css";

export function Enlace({ href, className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <Link {...props} href={href} className={`${styles.enlace} ${className}`} />;
}
