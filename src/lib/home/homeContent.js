import { redes, getCatalogUrl } from "../presentacion/presentacion";

// Cada tarjeta conserva juntos sus datos; añadir una red no depende de alinear índices.
export const homeNetworks = [
  {
    tipo: "nacionales",
    image: "laboratorio-abc.jpeg",
    description:
      "Investigación especializada con tecnología de vanguardia, compartida entre instituciones para formar especialistas y atender necesidades de la sociedad.",
    newsTitle: "UNAM logra avance histórico en energía limpia",
  },
  {
    tipo: "universitarios",
    image: "mision.png",
    description:
      "Investigación y servicios con tecnología de vanguardia que promueven la colaboración y el uso compartido de recursos entre entidades académicas.",
    newsTitle: "Secuenciación genética de precisión",
  },
  {
    tipo: "unidades",
    image: "vision.png",
    description:
      "Servicios con equipo especializado dentro y fuera de la UNAM, que fortalecen la vinculación con el sector productivo.",
    newsTitle: "Equipo compartido, ciencia que rinde más",
  },
];

// Noticias de demostración: mantener el aviso editorial hasta recibir contenido aprobado.
export const homeNews = homeNetworks.map(({ tipo, image, newsTitle }) => ({
  image: `/assets/images/${image}`,
  title: newsTitle,
  description: "Ejemplo de noticia · contenido pendiente de validación",
  href: getCatalogUrl({ tipo }),
  linkLabel: `Ver ${redes[tipo].nombre.toLocaleLowerCase("es")}`,
}));
