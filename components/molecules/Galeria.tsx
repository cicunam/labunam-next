import styles from "./Galeria.module.css";

export function Galeria({ imagenes, etiqueta = "Galería" }: { imagenes: { src: string; srcSet?: string; alt: string }[]; etiqueta?: string }) {
  const fotos = imagenes.slice(0, 3);
  if (!fotos.length) return <p className={styles.vacia}>Sin imágenes disponibles.</p>;
  return (
    <div className={styles.galeria} role="group" aria-label={etiqueta} data-cantidad={fotos.length}>
      {fotos.map((foto, posicion) => <img key={`${foto.src}-${posicion}`} className={styles.foto} src={foto.src} srcSet={foto.srcSet} alt={foto.alt} sizes={posicion === 0 ? "(min-width: 744px) 480px, 67vw" : "(min-width: 744px) 240px, 33vw"} loading="lazy" decoding="async" />)}
    </div>
  );
}
