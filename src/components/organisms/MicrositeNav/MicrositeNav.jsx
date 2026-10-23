"use client";

// LabUNAM
// Organismos
// MicrositeNav (encabezado del micrositio: regreso, nombre y secciones)
// Ivonne Aviles <daviles@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { redes } from "@/lib/redes/redes";

// Componentes
import AppLink from "../../atoms/AppLink/AppLink";
import Badge from "../../atoms/Badge/Badge";

// Estilos
import styles from "./MicrositeNav.module.css";

// Constantes
const secciones = [
  { clave: "", etiqueta: "Inicio" },
  { clave: "antecedentes", etiqueta: "Antecedentes" },
  { clave: "infraestructura", etiqueta: "Infraestructura" },
  { clave: "ubicacion", etiqueta: "Ubicación" },
  { clave: "asociados", etiqueta: "Asociados" },
];

// Definición del componente
const MicrositeNav = ({
  idLab, // Number - Identificador del laboratorio
  nombre, // String - Nombre visible
  siglas = "", // String Optional - Siglas, si el laboratorio las tiene
  tipo, // String - Clave de red: nacionales, universitarios, unidades o internacionales
}) => {
  // Estado
  const segmento = useSelectedLayoutSegment();
  const activa = segmento ?? "";
  const base = `/laboratorios/${idLab}/micrositio`;

  // Interfaz
  return (
    <header className={styles.header}>
      <AppLink href={`/laboratorios/${idLab}`}>← Volver a la ficha</AppLink>
      <Badge tone={redes[tipo].tone}>{redes[tipo].singular}</Badge>
      <h1 id="micrositio-titulo" className={styles.title}>{nombre}</h1>
      {siglas ? <p className={styles.acronym}>{siglas}</p> : null}
      <div className={styles.bar}>
        <nav className={styles.menu} aria-label="Secciones del micrositio">
          {secciones.map(({ clave, etiqueta }) => {
            const href = clave ? `${base}/${clave}` : base;
            return (
              <Link
                key={clave || "inicio"}
                href={href}
                className={styles.link}
                aria-current={activa === clave ? "page" : undefined}
              >
                {etiqueta}
              </Link>
            );
          })}
        </nav>
        <Link className={styles.cta} href={`/contacto?laboratorio=${idLab}`} prefetch={false}>
          Solicitar un servicio →
        </Link>
      </div>
    </header>
  );
};

export default MicrositeNav;