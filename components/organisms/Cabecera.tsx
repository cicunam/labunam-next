"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Cabecera.module.css";

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

export function Cabecera() {
  const ruta = usePathname();
  const [compacto, setCompacto] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const escritorio = window.matchMedia("(min-width: 1128px)");
    function cerrar() {
      setAbierto(false);
      boton.current?.focus();
    }
    function teclado(event: KeyboardEvent) {
      if (event.key === "Escape") cerrar();
      if (event.key !== "Tab") return;
      const enlaces = panel.current?.querySelectorAll<HTMLAnchorElement>("a");
      const ultimo = enlaces?.[enlaces.length - 1];
      if (event.shiftKey && document.activeElement === boton.current) {
        event.preventDefault();
        ultimo?.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        boton.current?.focus();
      }
    }
    document.addEventListener("keydown", teclado);
    escritorio.addEventListener("change", cerrar);
    return () => {
      document.documentElement.style.overflow = anterior;
      document.removeEventListener("keydown", teclado);
      escritorio.removeEventListener("change", cerrar);
    };
  }, [abierto]);

  useEffect(() => {
    let actual: Element | null | undefined;
    const observer = new IntersectionObserver(([entrada]) => setCompacto(!entrada.isIntersecting));
    function observar() {
      const elemento = document.querySelector("[data-buscador]");
      if (actual === elemento) return;
      observer.disconnect(); actual = elemento;
      if (elemento) observer.observe(elemento);
      else setCompacto(false);
    }
    const cambios = new MutationObserver(observar);
    cambios.observe(document.body, { childList: true, subtree: true }); observar();
    return () => { observer.disconnect(); cambios.disconnect(); };
  }, [ruta]);

  function activo(href: string) {
    return ruta === href || (href !== "/" && ruta.startsWith(`${href}/`));
  }

  return (
    <header className={styles.encabezado}>
      <a className={styles.saltar} href="#contenido">Saltar al contenido</a>
      <div className={styles["encabezado-barra"]}>
        <a href="https://www.unam.mx/" className={`${styles.logo} ${styles["logo-unam"]}`} target="_blank" rel="noopener">
          <img src="/assets/logos/unam.png" alt="Universidad Nacional Autónoma de México" />
        </a>
        <Link href="/" className={styles.logo}>
          <img src="/assets/logos/labunam.png" alt="LabUNAM" />
        </Link>
        <button type="button" className={styles.pildora} data-visible={compacto || undefined} aria-label="Abrir el buscador" onClick={() => {
          document.querySelector<HTMLInputElement>("#busqueda-q")?.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }}>Buscar laboratorios <span aria-hidden="true">⌕</span></button>
        <div className={styles["encabezado-acciones"]}>
          <nav className={styles["menu-directo"]} aria-label="Principal">
            {enlaces.map(({ href, texto }) => (
              <Link key={href} href={href} className={styles["menu-directo-enlace"]} aria-current={activo(href) ? "page" : undefined}>{texto}</Link>
            ))}
          </nav>
          <button ref={boton} className={styles["menu-toggle"]} type="button" aria-expanded={abierto} aria-controls="menu" aria-label={abierto ? "Cerrar menú" : "Abrir menú"} onClick={() => setAbierto(!abierto)}>
            {[0, 1, 2].map((barra) => <span key={barra} className={styles["menu-toggle-barra"]} />)}
          </button>
        </div>
        <nav ref={panel} className={styles.menu} id="menu" aria-label="Navegación" data-abierto={abierto ? "" : undefined} inert={!abierto}>
          <ul className={styles["menu-lista"]}>
            {enlaces.map(({ href, texto }) => (
              <li key={href}>
                <Link href={href} className={styles["menu-enlace"]} aria-current={activo(href) ? "page" : undefined} onClick={() => setAbierto(false)}>{texto}</Link>
              </li>
            ))}
          </ul>
          <hr className={styles["menu-filete"]} />
          <ul className={styles["menu-lista"]}>
            {redes.map(({ tipo, texto }) => (
              <li key={tipo}>
                <Link href={`/laboratorios?tipo=${tipo}`} className={`${styles["menu-enlace"]} ${styles["menu-enlace-red"]}`} data-tipo={tipo} onClick={() => setAbierto(false)}>{texto}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
