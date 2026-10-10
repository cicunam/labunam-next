// LabUNAM
// Organismos
// Carousel (carrusel de noticias; su interacción vive en public/js/carousel.js)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import Script from "next/script";

// Estilos
import styles from "./Carousel.module.css";

// Definición del componente
const Carousel = ({
  slides, // Array - Diapositivas con image, title, description, href y linkLabel
}) => {
  // Preparación de datos
  // Con más de una diapositiva se dibujan tres copias para cruzar ambos extremos sin saltos.
  const items = slides.length > 1 ? [...slides, ...slides, ...slides] : slides;

  // Interfaz
  return (
    <>
      <div
        className={styles.carousel}
        data-carousel
        role="region"
        aria-roledescription="carrusel"
        aria-label="Noticias destacadas"
      >
        <div className={styles["carousel-stage"]}>
          <ul
            className={styles["carousel-track"]}
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
                data-active={i === (slides.length > 1 ? slides.length : 0) || undefined}
                style={{ "--carousel-image": `url(${slide.image})` }}
              >
                <Link
                  draggable={false}
                  className={styles["carousel-content"]}
                  href={slide.href}
                >
                  <h3 className={styles["carousel-title"]}>{slide.title}</h3>
                  <p className={styles["carousel-text"]}>{slide.description}</p>
                  <span className={styles["carousel-cta"]}>{slide.linkLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`${styles["carousel-arrow"]} ${styles.previous}`}
            data-step="-1"
            aria-label="Noticia anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles["carousel-arrow"]} ${styles.next}`}
            data-step="1"
            aria-label="Noticia siguiente"
          >
            ›
          </button>
        </div>
        <div className={styles.controls}>
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              data-page={i}
              aria-label={`Ir a noticia ${i + 1}`}
              aria-pressed={i === 0}
            />
          ))}
        </div>
      </div>
      <Script
        src="/js/carousel.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default Carousel;
