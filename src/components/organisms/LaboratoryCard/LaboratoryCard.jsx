import { redes } from "@/lib/presentacion/presentacion";
import { getCapabilities, getCapabilityExcerpt } from "@/lib/capacidades/capacidades";
import { Icon } from "../../atoms/Icon/Icon";
import styles from "./LaboratoryCard.module.css";

export function LaboratoryCard({
  laboratorio: lab,
  foto,
  prioritaria = false,
  coincidencias = [],
  busqueda = "",
}) {
  const capacidades = getCapabilities(lab.servicios, lab.equipos, coincidencias);
  const area = lab.grupos?.length === 1 ? lab.grupos[0] : "general";
  const coincidencia = capacidades.coincide ? capacidades.items[0] : undefined;
  const detalle = coincidencia
    ? getCapabilityExcerpt(coincidencia.texto, busqueda)
    : lab.sedeNombre;
  return (
    <article className={styles.tarjeta}>
      <div
        className={styles.visual}
        data-tipo-imagen={foto.tipo}
        data-area={area}
      >
        {foto.tipo === "ilustracion" ? (
          <div
            className={styles.ilustracion}
            aria-hidden="true"
          >
            <span className={styles.orbita} />
            <span className={styles.simbolo}>
              <Icon
                nombre={area}
                tamano={76}
              />
            </span>
          </div>
        ) : (
          <img
            src={foto.src}
            srcSet={foto.srcSet}
            sizes="(min-width: 1128px) 25vw, (min-width: 744px) 33vw, 100vw"
            alt=""
            loading={prioritaria ? "eager" : "lazy"}
            fetchPriority={prioritaria ? "high" : "auto"}
            decoding="async"
          />
        )}
        <span
          className={styles.insignia}
          data-tipo={lab.tipo}
        >
          {redes[lab.tipo].singular}
        </span>
        <span
          className={styles.flecha}
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
      <div className={styles.contenido}>
        <h3 className={styles.titulo}>
          <button
            className={styles.disparador}
            type="button"
            data-ficha={lab.idLab}
            aria-haspopup="dialog"
            title={lab.nombre}
          >
            {lab.nombre}
          </button>
        </h3>
        <p
          className={styles.entidad}
          title={lab.entidad}
        >
          {lab.entidad}
        </p>
        {detalle && (
          <p
            className={styles.detalle}
            data-coincidencia={Boolean(coincidencia)}
            title={coincidencia?.texto ?? detalle}
          >
            {detalle}
          </p>
        )}
      </div>
    </article>
  );
}
