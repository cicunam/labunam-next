import { redes, getCatalogUrl } from "../presentacion/presentacion";

// Cada tarjeta conserva juntos sus datos; añadir una red no depende de alinear índices.
export const homeNetworks = [
  {
    tipo: "nacionales",
    imagen: "laboratorio-abc.jpeg",
    descripcion:
      "Investigación especializada con tecnología de vanguardia, compartida entre instituciones para formar especialistas y atender necesidades de la sociedad.",
    noticia: "UNAM logra avance histórico en energía limpia",
  },
  {
    tipo: "universitarios",
    imagen: "mision.png",
    descripcion:
      "Investigación y servicios con tecnología de vanguardia que promueven la colaboración y el uso compartido de recursos entre entidades académicas.",
    noticia: "Secuenciación genética de precisión",
  },
  {
    tipo: "unidades",
    imagen: "vision.png",
    descripcion:
      "Servicios con equipo especializado dentro y fuera de la UNAM, que fortalecen la vinculación con el sector productivo.",
    noticia: "Equipo compartido, ciencia que rinde más",
  },
];

// Noticias de demostración: mantener el aviso editorial hasta recibir contenido aprobado.
export const homeNews = homeNetworks.map(({ tipo, imagen, noticia }) => ({
  imagen: `/assets/images/${imagen}`,
  titulo: noticia,
  texto: "Ejemplo de noticia · contenido pendiente de validación",
  href: getCatalogUrl({ tipo }),
  enlace: `Ver ${redes[tipo].nombre.toLocaleLowerCase("es")}`,
}));
