import Link from "next/link";
import { useState } from "react";
import { formatCounts, redes } from "@/lib/presentacion/presentacion";
import Gallery from "../../molecules/Gallery/Gallery";
import Tab from "../../molecules/Tab/Tab";
import Badge from "../../atoms/Badge/Badge";
import styles from "./LaboratoryDetails.module.css";

const tabs = ["Servicios", "Equipamiento", "Distinciones", "Ubicación"];
const LaboratoryDetails = ({ laboratorio: lab, isPage = false }) => {
  const [activeIndex, setActive] = useState(0);
  const Title = isPage ? "h1" : "h2";
  const content = [
    lab.servicios,
    lab.equipos,
    lab.distinciones,
    [lab.sedeNombre, lab.ubicacion].filter(Boolean),
  ];

  return (
    <>
      <div className={styles["details-body"]}>
        <Gallery images={lab.galeria} />
        <div className={styles["details-header"]}>
          <Badge tone={redes[lab.tipo].tone}>{redes[lab.tipo].singular}</Badge>
          <Title
            id="details-title"
            className={styles["details-title"]}
          >
            {lab.nombre}
          </Title>
          <p className={styles["details-entity"]}>{lab.entidad}</p>
          <p className={styles["details-location"]}>{lab.sedeNombre}</p>
        </div>
        <div
          className={styles["details-tabs"]}
          role="tablist"
          aria-label="Información del laboratorio"
        >
          {tabs.map((name, i) => (
            <Tab
              key={name}
              id={`details-tab-${i}`}
              panelId={`details-panel-${i}`}
              selected={activeIndex === i}
              onClick={() => setActive(i)}
              onKeyDown={(event) => {
                let nextIndex = i;
                if (event.key === "ArrowRight") {
                  nextIndex = (i + 1) % 4;
                } else if (event.key === "ArrowLeft") {
                  nextIndex = (i + 3) % 4;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = 3;
                } else {
                  return;
                }
                event.preventDefault();
                setActive(nextIndex);
                document.querySelector(`#details-tab-${nextIndex}`)?.focus();
              }}
            >
              {name}
            </Tab>
          ))}
        </div>
        {content.map((list, i) => (
          <div
            key={i}
            className={styles["details-panel"]}
            id={`details-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`details-tab-${i}`}
            tabIndex={0}
            hidden={activeIndex !== i}
          >
            {list.length ? (
              <ul className={styles["details-list"]}>
                {list.map((text, n) => (
                  <li key={n}>{text}</li>
                ))}
              </ul>
            ) : (
              <p className={styles["details-empty"]}>Sin información registrada todavía.</p>
            )}
            {i === 3 && lab.mapa && (
              <a
                className={styles["details-mapa"]}
                href={lab.mapa}
                target="_blank"
                rel="noopener"
              >
                Ver en el mapa
              </a>
            )}
          </div>
        ))}
      </div>
      <footer className={styles["details-footer"]}>
        <p className={styles["details-footer-note"]}>
          {formatCounts(lab.servicios.length, lab.equipos.length)}
        </p>
        <div className={styles["details-footer-actions"]}>
          {lab.sitio && (
            <a
              className={styles["details-mapa"]}
              href={lab.sitio}
              target="_blank"
              rel="noopener"
            >
              Sitio web ↗
            </a>
          )}
          <Link
            className={styles["details-website"]}
            href={`/contacto?laboratorio=${lab.idLab}`}
            prefetch={false}
          >
            Solicitar un servicio →
          </Link>
        </div>
      </footer>
    </>
  );
};

export default LaboratoryDetails;
