// LabUNAM
// Organismos
// LaboratoryCard (tarjeta de laboratorio en catálogo y portada)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { redes } from "@/lib/presentacion/presentacion";
import { getCapabilities, getCapabilityExcerpt } from "@/lib/capacidades/capacidades";

// Componentes
import Icon from "../../atoms/Icon/Icon";

// Estilos
import styles from "./LaboratoryCard.module.css";

// Definición del componente
const LaboratoryCard = ({
  laboratorio: lab, // Object - Laboratorio del catálogo: idLab, nombre, entidad, sedeNombre, tipo, servicios, equipos y grupos
  photo, // Object - Imagen elegida por getPhotos: src, srcSet y tipo ("foto", "logo" o "illustration")
  priority = false, // Boolean Optional - Carga la imagen de inmediato; sólo la primera tarjeta visible
  matches = [], // Array Optional - Servicios o equipos que coinciden con la búsqueda; el primero sustituye a la sede
  query = "", // String Optional - Texto buscado, para acercar el fragmento a la palabra
}) => {
  // Preparación de datos
  const capacidades = getCapabilities(lab.servicios, lab.equipos, matches);
  const area = lab.grupos?.length === 1 ? lab.grupos[0] : "general";
  const match = capacidades.coincide ? capacidades.items[0] : undefined;
  const detail = match ? getCapabilityExcerpt(match.texto, query) : lab.sedeNombre;

  // Interfaz
  // El título es un botón con data-details: LaboratoryDialog escucha ese atributo
  // para abrir la ficha sin que la tarjeta conozca el diálogo.
  return (
    <article className={styles.card}>
      <div
        className={styles.visual}
        data-image-type={photo.tipo}
        data-area={area}
      >
        {photo.tipo === "illustration" ? (
          <div
            className={styles.illustration}
            aria-hidden="true"
          >
            <span className={styles.orbit} />
            <span className={styles.symbol}>
              <Icon
                name={area}
                size={76}
              />
            </span>
          </div>
        ) : (
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 1128px) 25vw, (min-width: 744px) 33vw, 100vw"
            alt=""
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        )}
        <span
          className={styles.badge}
          data-type={lab.tipo}
        >
          {redes[lab.tipo].singular}
        </span>
        <span
          className={styles.arrow}
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <button
            className={styles.trigger}
            type="button"
            data-details={lab.idLab}
            aria-haspopup="dialog"
            title={lab.nombre}
          >
            {lab.nombre}
          </button>
        </h3>
        <p
          className={styles.entity}
          title={lab.entidad}
        >
          {lab.entidad}
        </p>
        {detail && (
          <p
            className={styles.detail}
            data-match={Boolean(match)}
            title={match?.texto ?? detail}
          >
            {detail}
          </p>
        )}
      </div>
    </article>
  );
};

export default LaboratoryCard;
