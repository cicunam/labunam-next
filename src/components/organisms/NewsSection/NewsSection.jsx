// LabUNAM
// Organismos
// NewsSection (noticias de la portada en carrusel)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Carousel from "../Carousel/Carousel";

// Estilos
import styles from "./NewsSection.module.css";

// Constantes
// Noticias de demostración: mantener el aviso editorial hasta recibir contenido aprobado.
const news = [
  {
    image: "/assets/images/laboratorio-abc.jpeg",
    title: "UNAM logra avance histórico en energía limpia",
    description: "Ejemplo de noticia · contenido pendiente de validación",
    href: "/laboratorios?tipo=nacionales",
    linkLabel: "Ver laboratorios nacionales",
  },
  {
    image: "/assets/images/mision.png",
    title: "Secuenciación genética de precisión",
    description: "Ejemplo de noticia · contenido pendiente de validación",
    href: "/laboratorios?tipo=universitarios",
    linkLabel: "Ver laboratorios universitarios",
  },
  {
    image: "/assets/images/vision.png",
    title: "Equipo compartido, ciencia que rinde más",
    description: "Ejemplo de noticia · contenido pendiente de validación",
    href: "/laboratorios?tipo=unidades",
    linkLabel: "Ver unidades de apoyo",
  },
];

// Definición del componente
// No recibe props: las noticias de ejemplo están en la constante news.
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
      <Carousel slides={news} />
    </section>
  );
};

export default NewsSection;
