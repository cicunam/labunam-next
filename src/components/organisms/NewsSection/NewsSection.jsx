import styles from "./NewsSection.module.css";
import Carousel from "../Carousel/Carousel";
import { homeNews } from "@/lib/home/homeContent";

const NewsSection = () => {
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
