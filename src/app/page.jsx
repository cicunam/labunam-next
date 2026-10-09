import Link from "next/link";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { countFacet } from "@/lib/buscador/buscador";
import { getPhotos, readPhotos } from "@/lib/fotos/fotos";
import { grupos } from "@/lib/grupos/grupos";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";
import { SearchBar } from "@/components/organisms/SearchBar/SearchBar";
import { LaboratoryCard } from "@/components/organisms/LaboratoryCard/LaboratoryCard";
import { LaboratoryDialog } from "@/components/organisms/LaboratoryDialog/LaboratoryDialog";
import { Carousel } from "@/components/organisms/Carousel/Carousel";
import { About } from "@/components/organisms/About/About";
import { LaboratoryMap } from "@/components/organisms/LaboratoryMap/LaboratoryMap";
import styles from "./Inicio.module.css";
export const dynamic = "force-dynamic";
const imagenes = ["laboratorio-abc.jpeg", "mision.png", "vision.png"];
const tipos = ["nacionales", "universitarios", "unidades"];
const descripciones = [
    "Investigación especializada con tecnología de vanguardia, compartida entre instituciones para formar especialistas y atender necesidades de la sociedad.",
    "Investigación y servicios con tecnología de vanguardia que promueven la colaboración y el uso compartido de recursos entre entidades académicas.",
    "Servicios con equipo especializado dentro y fuera de la UNAM, que fortalecen la vinculación con el sector productivo.",
];
export default async function HomePage() {
    const [catalogo, fotos] = await Promise.all([loadCatalog(), readPhotos()]);
    const totales = countFacet(catalogo.laboratorios, {}, "tipo", [...tipos]);
    const areas = countFacet(catalogo.laboratorios, {}, "disciplina", grupos.map((g) => g.clave));
    const recientes = [...catalogo.laboratorios].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idLab - a.idLab).slice(0, 4);
    return <>
    <SearchBar titulo="Encuentra el laboratorio que necesitas" sedes={catalogo.sedes} sugerencias={catalogo.sugerencias} frecuentes={["Microscopía", "Rayos X", "Cromatografía"]}/>
    <section className={`contenido ${styles.redes}`} aria-labelledby="redes-titulo">
      <h2 id="redes-titulo" className="banda-titulo">Tres redes, una universidad</h2>
      <p className="banda-entrada">Explora la infraestructura de investigación de la UNAM.</p>
      <ul className={styles["redes-lista"]}>{tipos.map((tipo, i) => <li key={tipo}><Link className={styles.red} href={getCatalogUrl({ tipo })} data-tipo={tipo}>
        <span className={styles["red-foto"]} style={{ "--foto": `url(/assets/images/${imagenes[i]})` }}/>
        <span className={styles["red-cuerpo"]}><span className={styles["red-titulo"]}>{redes[tipo].nombre}</span><span className={styles["red-cuenta"]}>{totales[tipo]} laboratorios</span><span className={styles["red-texto"]}>{descripciones[i]}</span></span>
      </Link></li>)}</ul>
    </section>
    <section className={`contenido ${styles.destacados}`} aria-labelledby="destacados-titulo">
      <div className={styles["destacados-cabeza"]}><h2 id="destacados-titulo" className="banda-titulo">Recién incorporados</h2><Link className={styles["destacados-todos"]} href="/laboratorios">Ver los {catalogo.laboratorios.length}</Link></div>
      <div className={styles.reticula}>{recientes.map((lab) => <LaboratoryCard key={lab.idLab} laboratorio={lab} foto={getPhotos(lab.idLab, fotos, lab.grupos)[0]}/>)}</div>
    </section>
    <section className={`contenido ${styles.disciplinas} ${styles["banda-tinte"]}`} aria-labelledby="disciplinas-titulo">
      <h2 id="disciplinas-titulo" className="banda-titulo">Buscar por disciplina</h2>
      <ul className={styles["disciplinas-lista"]}>{grupos.map((g) => <li key={g.clave}><Link className={styles.disciplina} href={getCatalogUrl({ disciplina: g.clave })}><span className={styles["disciplina-nombre"]}>{g.etiqueta}</span><span className={styles["disciplina-cuenta"]}>{areas[g.clave]} laboratorios</span></Link></li>)}</ul>
    </section>
    <LaboratoryMap sedes={catalogo.sedes} />
    <section className={`contenido ${styles.noticias}`} aria-labelledby="noticias-titulo">
      <h2 id="noticias-titulo" className="banda-titulo">Noticias</h2><p className="banda-entrada">Contenido de ejemplo para revisión editorial.</p>
      <Carousel slides={tipos.map((tipo, i) => ({ imagen: `/assets/images/${imagenes[i]}`, titulo: ["UNAM logra avance histórico en energía limpia", "Secuenciación genética de precisión", "Equipo compartido, ciencia que rinde más"][i], texto: "Ejemplo de noticia · contenido pendiente de validación", href: getCatalogUrl({ tipo }), enlace: `Ver ${redes[tipo].nombre.toLocaleLowerCase("es")}` }))}/>
    </section>
    <About /><LaboratoryDialog />
  </>;
}
