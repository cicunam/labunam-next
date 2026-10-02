import styles from "./Inicio.module.css";

export default function Inicio() {
  return (
    <section className={`contenido ${styles.presentacion}`} aria-labelledby="titulo-inicio">
      <h1 id="titulo-inicio">LabUNAM</h1>
      <p>Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.</p>
    </section>
  );
}
