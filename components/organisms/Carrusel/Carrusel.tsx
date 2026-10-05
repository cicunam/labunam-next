import type { CSSProperties } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./Carrusel.module.css";

type Slide = { imagen: string; titulo: string; texto: string; href: string; enlace: string };
export function Carrusel({ slides }: { slides: Slide[] }) {
  return <>
    <div className={styles.carousel} data-carrusel role="region" aria-roledescription="carrusel" aria-label="Noticias destacadas">
      <div className={styles["carousel-escenario"]}>
        <ul className={styles["carousel-pista"]} data-slides tabIndex={0} aria-label="Noticias">
          {slides.map((slide, i) => <li key={slide.titulo} className={styles["carousel-slide"]} data-slide data-activo={i === 0 || undefined} style={{ "--carousel-imagen": `url(${slide.imagen})` } as CSSProperties}>
            <Link className={styles["carousel-contenido"]} href={slide.href}><h3 className={styles["carousel-titulo"]}>{slide.titulo}</h3><p className={styles["carousel-texto"]}>{slide.texto}</p><span className={styles["carousel-cta"]}>{slide.enlace}</span></Link>
          </li>)}
        </ul>
        <button type="button" className={`${styles["carousel-flecha"]} ${styles.anterior}`} data-paso="-1" aria-label="Noticia anterior">‹</button>
        <button type="button" className={`${styles["carousel-flecha"]} ${styles.siguiente}`} data-paso="1" aria-label="Noticia siguiente">›</button>
      </div>
      <div className={styles.controles}>
        {slides.map((slide, i) => <button key={slide.titulo} type="button" data-pagina={i} aria-label={`Ir a noticia ${i + 1}`} aria-pressed={i === 0} />)}
        <button type="button" className={styles.pausa} data-pausa aria-label="Pausar noticias">Pausar</button>
      </div>
    </div>
    <Script src="/js/carrusel.js" strategy="afterInteractive" />
  </>;
}
