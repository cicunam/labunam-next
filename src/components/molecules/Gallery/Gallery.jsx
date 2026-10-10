import styles from "./Gallery.module.css";

const Gallery = ({ images, label = "Galería" }) => {
  const photos = images.slice(0, 3);
  if (!photos.length) {
    return <p className={styles.empty}>Sin imágenes disponibles.</p>;
  }
  return (
    <div
      className={styles.gallery}
      role="group"
      aria-label={label}
      data-count={photos.length}
      data-fallback={photos[0]?.tipo === "illustration"}
    >
      {photos.map((photo, position) => (
        <img
          key={`${photo.src}-${position}`}
          className={styles.photo}
          data-image-type={photo.tipo}
          src={photo.src}
          srcSet={photo.srcSet}
          alt={photo.alt}
          sizes={
            position === 0 ? "(min-width: 744px) 480px, 67vw" : "(min-width: 744px) 240px, 33vw"
          }
          loading="lazy"
          decoding="async"
        />
      ))}
      {photos[0]?.tipo === "illustration" && (
        <span className={styles.notice}>Sin fotografía disponible</span>
      )}
    </div>
  );
};

export default Gallery;
