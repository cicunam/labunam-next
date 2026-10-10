"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeaderMenu } from "./useHeaderMenu";
import { useCompactSearch } from "./useCompactSearch";
import styles from "./Header.module.css";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/laboratorios", texto: "Laboratorios" },
  { href: "/contacto", texto: "Contacto" },
];
const redes = [
  { tipo: "nacionales", texto: "Laboratorios nacionales" },
  { tipo: "universitarios", texto: "Laboratorios universitarios" },
  { tipo: "unidades", texto: "Unidades de apoyo" },
];
const Header = () => {
  const ruta = usePathname();
  const compacto = useCompactSearch(ruta);
  const { abierto, boton, panel, toggleMenu, closeMenu } = useHeaderMenu();

  function focusSearch() {
    document.querySelector("#busqueda-q")?.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }

  function isActive(href) {
    return ruta === href || (href !== "/" && ruta.startsWith(`${href}/`));
  }
  return (
    <header className={styles.encabezado}>
      <a
        className={styles.saltar}
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <div className={styles["encabezado-barra"]}>
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
          className={styles.pildora}
          data-visible={compacto || undefined}
          aria-label="Abrir el buscador"
          onClick={focusSearch}
        >
          Buscar laboratorios <span aria-hidden="true">⌕</span>
        </button>
        <div className={styles["encabezado-acciones"]}>
          <nav
            className={styles["menu-directo"]}
            aria-label="Principal"
          >
            {enlaces.map(({ href, texto }) => (
              <Link
                key={href}
                href={href}
                className={styles["menu-directo-enlace"]}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {texto}
              </Link>
            ))}
          </nav>
          <button
            ref={boton}
            className={styles["menu-toggle"]}
            type="button"
            aria-expanded={abierto}
            aria-controls="menu"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={toggleMenu}
          >
            {[0, 1, 2].map((barra) => (
              <span
                key={barra}
                className={styles["menu-toggle-barra"]}
              />
            ))}
          </button>
        </div>
        <nav
          ref={panel}
          className={styles.menu}
          id="menu"
          aria-label="Navegación"
          data-abierto={abierto ? "" : undefined}
          inert={!abierto}
        >
          <ul className={styles["menu-lista"]}>
            {enlaces.map(({ href, texto }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={styles["menu-enlace"]}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
          <hr className={styles["menu-filete"]} />
          <ul className={styles["menu-lista"]}>
            {redes.map(({ tipo, texto }) => (
              <li key={tipo}>
                <Link
                  href={`/laboratorios?tipo=${tipo}`}
                  className={`${styles["menu-enlace"]} ${styles["menu-enlace-red"]}`}
                  data-tipo={tipo}
                  onClick={closeMenu}
                >
                  {texto}
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
