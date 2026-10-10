import styles from "./NewsSection.module.css";
import Carousel from "../Carousel/Carousel";
import { homeNews } from "@/lib/home/homeContent";

const NewsSection = () => {
  return (
    <section
      className={`contenido ${styles.noticias}`}
      aria-labelledby="noticias-titulo"
    >
      <h2
        id="noticias-titulo"
        className="banda-titulo"
      >
        Noticias
      </h2>
      <p className="banda-entrada">Contenido de ejemplo para revisión editorial.</p>
      <Carousel slides={homeNews} />
    </section>
  );
};

export default NewsSection;
