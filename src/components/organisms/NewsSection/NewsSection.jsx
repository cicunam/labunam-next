// LabUNAM
// Organismos
// NewsSection (noticias de la portada en carrusel)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { homeNews } from "@/lib/home/homeContent";

// Componentes
import Carousel from "../Carousel/Carousel";

// Estilos
import styles from "./NewsSection.module.css";

// Definición del componente
// No recibe props: las noticias de ejemplo salen de homeNews.
const NewsSection = () => {
  // Interfaz
  return (
    <section
      className={`content ${styles.news}`}
      aria-labelledby="news-title"
    >
      <h2
        id="news-title"
        className="band-title"
      >
        Noticias
      </h2>
      <p className="band-entry">Contenido de ejemplo para revisión editorial.</p>
      <Carousel slides={homeNews} />
    </section>
  );
};

export default NewsSection;
