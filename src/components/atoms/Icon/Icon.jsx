// LabUNAM
// Átomos
// Icon (ícono SVG de trazo por nombre)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Estilos
import styles from "./Icon.module.css";

// Constantes
// Trazos de cada ícono en una retícula de 24×24; las claves de área coinciden con grupos.js.
const paths = {
  general: "M4 21h16M6 21V4h12v17M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-6h4v6",
  all: "M4 12h16M4 6h16M4 18h16",
  biologia: "M7 4c0 6 10 10 10 16M17 4c0 6-10 10-10 16M8 8h8M7.5 12h9M8 16h8",
  quimica: "M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M9 3h6M7 15h10",
  fisica:
    "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 12m-9 0a9 4 0 1 0 18 0a9 4 0 1 0-18 0M12 12m-9 0a9 4 30 1 0 18 0a9 4 30 1 0-18 0",
  materiales: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  computo: "M4 5h16v10H4zM9 19h6M12 15v4M8 9l2 2-2 2M13 13h3",
  tierra: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18",
  salud: "M12 5v14M5 12h14M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  ingenieria:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
  sostenibilidad: "M12 21c0-6 3-11 8-13-1 8-4 11-8 13zM12 21c0-5-2-9-6-10 1 6 3 9 6 10zM12 21v-4",
  humanidades: "M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z",
  search: "M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15M16 16l5 5",
  close: "M6 6l12 12M18 6L6 18",
};
// Definición del componente
const Icon = ({
  name, // String - Clave de paths: un área de disciplina, "general", "all", "search" o "close"
  label, // String Optional - Texto accesible; sin él el ícono es decorativo y se oculta a lectores de pantalla
  size = 24, // Number Optional - Ancho y alto en píxeles
}) => {
  // Interfaz
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Icon;
