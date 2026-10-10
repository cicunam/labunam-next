"use client";

// LabUNAM
// Organismos
// Header (cabecera con navegación, menú móvil y acceso al buscador)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { usePathname } from "next/navigation";

// Mecanismos
import { useHeaderMenu } from "./useHeaderMenu";
import { useCompactSearch } from "./useCompactSearch";

// Estilos
import styles from "./Header.module.css";

// Constantes
const links = [
  { href: "/", label: "Inicio" },
  { href: "/laboratorios", label: "Laboratorios" },
  { href: "/contacto", label: "Contacto" },
];

const redes = [
  { tipo: "nacionales", label: "Laboratorios nacionales" },
  { tipo: "universitarios", label: "Laboratorios universitarios" },
  { tipo: "unidades", label: "Unidades de apoyo" },
];

// Definición del componente
// No recibe props: la ruta activa sale de usePathname.
const Header = () => {
  // Mecanismos
  const pathname = usePathname();
  const compact = useCompactSearch(pathname);
  const { open, button, panel, toggleMenu, closeMenu } = useHeaderMenu();

  // Gestores de evento
  function focusSearch() {
    document.querySelector("#search-q")?.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }

  // Utilidades
  function isActive(href) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  // Interfaz
  return (
    <header className={styles.header}>
      <a
        className={styles.skip}
        href="#content"
      >
        Saltar al contenido
      </a>
      <div className={styles["header-bar"]}>
        <a
          href="https://www.unam.mx/"
          className={`${styles.logo} ${styles["logo-unam"]}`}
          target="_blank"
          rel="noopener"
        >
          <img
            src="/assets/logos/unam.webp"
            width={320}
            height={85}
            alt="Universidad Nacional Autónoma de México"
          />
        </a>
        <Link
          href="/"
          className={styles.logo}
        >
          <img
            src="/assets/logos/labunam.webp"
            width={170}
            height={50}
            alt="LabUNAM"
          />
        </Link>
        <button
          type="button"
          className={styles.pill}
          data-visible={compact || undefined}
          aria-label="Abrir el buscador"
          onClick={focusSearch}
        >
          Buscar laboratorios <span aria-hidden="true">⌕</span>
        </button>
        <div className={styles["header-actions"]}>
          <nav
            className={styles["menu-direct"]}
            aria-label="Principal"
          >
            {links.map(({ href, label: text }) => (
              <Link
                key={href}
                href={href}
                className={styles["menu-direct-link"]}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {text}
              </Link>
            ))}
          </nav>
          <button
            ref={button}
            className={styles["menu-toggle"]}
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={toggleMenu}
          >
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className={styles["menu-toggle-bar"]}
              />
            ))}
          </button>
        </div>
        <nav
          ref={panel}
          className={styles.menu}
          id="menu"
          aria-label="Navegación"
          data-abierto={open ? "" : undefined}
          inert={!open}
        >
          <ul className={styles["menu-list"]}>
            {links.map(({ href, label: text }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={styles["menu-link"]}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
          <hr className={styles["menu-border"]} />
          <ul className={styles["menu-list"]}>
            {redes.map(({ tipo, label: text }) => (
              <li key={tipo}>
                <Link
                  href={`/laboratorios?tipo=${tipo}`}
                  className={`${styles["menu-link"]} ${styles["menu-link-network"]}`}
                  data-type={tipo}
                  onClick={closeMenu}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
