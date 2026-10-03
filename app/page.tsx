import Link from "next/link";
import type { CSSProperties } from "react";
import { cargarCatalogo } from "@/lib/catalogo";
import { contarEje } from "@/lib/buscador";
import { fotosDe, leerFotos } from "@/lib/fotos";
import { grupos } from "@/lib/grupos";
import { redes, urlCatalogo } from "@/lib/presentacion";
import { Buscador } from "@/components/organisms/Buscador";
import { Tarjeta } from "@/components/organisms/Tarjeta";
import { Ficha } from "@/components/organisms/Ficha";
import { Carrusel } from "@/components/organisms/Carrusel";
import { Institucional } from "@/components/organisms/Institucional";
import styles from "./Inicio.module.css";

export const dynamic = "force-dynamic";
const imagenes = ["laboratorio-abc.jpeg", "mision.png", "vision.png"];
const tipos = ["nacionales", "universitarios", "unidades"] as const;
const descripciones = ["Infraestructura de gran escala reconocida por la SECIHTI, abierta a todo el país.", "Equipo puesto en común entre institutos, centros, facultades y escuelas.", "Servicios técnicos que respaldan de forma transversal la investigación y la docencia."];
export default async function Inicio() {
  const [catalogo, fotos] = await Promise.all([cargarCatalogo(), leerFotos()]);
  const totales = contarEje(catalogo.laboratorios, {}, "tipo", [...tipos]);
  const areas = contarEje(catalogo.laboratorios, {}, "disciplina", grupos.map((g) => g.clave));
  const recientes = [...catalogo.laboratorios].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idLab - a.idLab).slice(0, 4);
  return <>
    <Buscador titulo="Encuentra el laboratorio que necesitas" sedes={catalogo.sedes} sugerencias={catalogo.sugerencias} frecuentes={["Microscopía", "Rayos X", "Cromatografía"]} />
    <section className={`contenido ${styles.redes}`} aria-labelledby="redes-titulo">
      <h2 id="redes-titulo" className="banda-titulo">Tres redes, una universidad</h2>
      <p className="banda-entrada">Explora la infraestructura de investigación de la UNAM.</p>
      <ul className={styles["redes-lista"]}>{tipos.map((tipo, i) => <li key={tipo}><Link className={styles.red} href={urlCatalogo({ tipo })} data-tipo={tipo}>
        <span className={styles["red-foto"]} style={{ "--foto": `url(/assets/images/${imagenes[i]})` } as CSSProperties} />
        <span className={styles["red-cuerpo"]}><span className={styles["red-titulo"]}>{redes[tipo].nombre}</span><span className={styles["red-cuenta"]}>{totales[tipo]} laboratorios</span><span className={styles["red-texto"]}>{descripciones[i]}</span></span>
      </Link></li>)}</ul>
    </section>
    <section className={`contenido ${styles.destacados}`} aria-labelledby="destacados-titulo">
      <div className={styles["destacados-cabeza"]}><h2 id="destacados-titulo" className="banda-titulo">Recién incorporados</h2><Link className={styles["destacados-todos"]} href="/laboratorios">Ver los {catalogo.laboratorios.length}</Link></div>
      <div className={styles.reticula}>{recientes.map((lab) => <Tarjeta key={lab.idLab} laboratorio={{ ...lab, servicios: lab.servicios.length, equipos: lab.equipos.length }} foto={fotosDe(lab.idLab, fotos)[0]} />)}</div>
    </section>
    <section className={`contenido ${styles.disciplinas} ${styles["banda-tinte"]}`} aria-labelledby="disciplinas-titulo">
      <h2 id="disciplinas-titulo" className="banda-titulo">Buscar por disciplina</h2>
      <ul className={styles["disciplinas-lista"]}>{grupos.map((g) => <li key={g.clave}><Link className={styles.disciplina} href={urlCatalogo({ disciplina: g.clave })}><span className={styles["disciplina-nombre"]}>{g.etiqueta}</span><span className={styles["disciplina-cuenta"]}>{areas[g.clave]} laboratorios</span></Link></li>)}</ul>
    </section>
    <section className={`contenido ${styles.noticias}`} aria-labelledby="noticias-titulo">
      <h2 id="noticias-titulo" className="banda-titulo">Noticias</h2><p className="banda-entrada">Contenido de ejemplo para revisión editorial.</p>
      <Carrusel slides={tipos.map((tipo, i) => ({ imagen: `/assets/images/${imagenes[i]}`, titulo: ["UNAM logra avance histórico en energía limpia", "Secuenciación genética de precisión", "Equipo compartido, ciencia que rinde más"][i], texto: "Ejemplo de noticia · contenido pendiente de validación", href: urlCatalogo({ tipo }), enlace: `Ver ${redes[tipo].nombre.toLocaleLowerCase("es")}` }))} />
    </section>
    <Institucional /><Ficha />
  </>;
}
