import Link from "next/link";
import Script from "next/script";
import styles from "./Carousel.module.css";

export function Carousel({ slides }) {
  const items = slides.length > 1 ? [...slides, ...slides, ...slides] : slides;
  return (
    <>
      <div
        className={styles.carousel}
        data-carrusel
        role="region"
        aria-roledescription="carrusel"
        aria-label="Noticias destacadas"
      >
        <div className={styles["carousel-escenario"]}>
          <ul
            className={styles["carousel-pista"]}
            data-slides
            tabIndex={0}
            aria-label="Noticias"
          >
            {items.map((slide, i) => (
              <li
                key={i}
                className={styles["carousel-slide"]}
                data-slide
                data-index={i % slides.length}
                data-copy={
                  (slides.length > 1 && (i < slides.length || i >= slides.length * 2)) || undefined
                }
                inert={
                  (slides.length > 1 && (i < slides.length || i >= slides.length * 2)) || undefined
                }
                aria-hidden={
                  (slides.length > 1 && (i < slides.length || i >= slides.length * 2)) || undefined
                }
                data-activo={i === (slides.length > 1 ? slides.length : 0) || undefined}
                style={{ "--carousel-imagen": `url(${slide.imagen})` }}
              >
                <Link
                  draggable={false}
                  className={styles["carousel-contenido"]}
                  href={slide.href}
                >
                  <h3 className={styles["carousel-titulo"]}>{slide.titulo}</h3>
                  <p className={styles["carousel-texto"]}>{slide.texto}</p>
                  <span className={styles["carousel-cta"]}>{slide.enlace}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`${styles["carousel-flecha"]} ${styles.anterior}`}
            data-paso="-1"
            aria-label="Noticia anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles["carousel-flecha"]} ${styles.siguiente}`}
            data-paso="1"
            aria-label="Noticia siguiente"
          >
            ›
          </button>
        </div>
        <div className={styles.controles}>
          {slides.map((slide, i) => (
            <button
              key={slide.titulo}
              type="button"
              data-pagina={i}
              aria-label={`Ir a noticia ${i + 1}`}
              aria-pressed={i === 0}
            />
          ))}
        </div>
      </div>
      <Script
        src="/js/carrusel.js"
        strategy="afterInteractive"
      />
    </>
  );
}
