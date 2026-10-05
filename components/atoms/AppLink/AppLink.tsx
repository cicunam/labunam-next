import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import styles from "./AppLink.module.css";

export function AppLink({ href, className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <Link {...props} href={href} className={`${styles.enlace} ${className}`} />;
}
