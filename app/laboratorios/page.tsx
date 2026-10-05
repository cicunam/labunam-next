import Link from "next/link";
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { filterLaboratorios, normalizeCriteria } from "@/lib/buscador/buscador";
import { prepareFilters } from "@/lib/filtros/filtros";
import { getPhotos, readPhotos } from "@/lib/fotos/fotos";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";
import type { Criterios, TipoLaboratorio } from "@/lib/tipos/tipos";
import { SearchBar } from "@/components/organisms/SearchBar/SearchBar";
import { FilterDialog } from "@/components/organisms/FilterDialog/FilterDialog";
import { DisciplineBar } from "@/components/organisms/DisciplineBar/DisciplineBar";
import { LaboratoryCard } from "@/components/organisms/LaboratoryCard/LaboratoryCard";
import { LaboratoryDialog } from "@/components/organisms/LaboratoryDialog/LaboratoryDialog";
import { ActiveChip } from "@/components/molecules/ActiveChip/ActiveChip";
import styles from "./Laboratorios.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Laboratorios" };
export default async function LaboratoriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const parametros = await searchParams;
  const [catalogo, fotos] = await Promise.all([loadCatalog(), readPhotos()]);
  const criterios = normalizeCriteria(catalogo.laboratorios, Object.fromEntries(Object.entries(parametros).filter(([, v]) => typeof v === "string")) as Criterios);
  const resultados = filterLaboratorios(catalogo.laboratorios, criterios);
  const { filtros, total } = prepareFilters(catalogo, criterios);
  const titulo = criterios.tipo ? redes[criterios.tipo as TipoLaboratorio].nombre : "Laboratorios de la UNAM";
  const etiquetas = Object.fromEntries(filtros.flatMap((filtro) => filtro.opciones.map((o) => [`${filtro.eje}:${o.clave}`, o.etiqueta])));
  const activos = Object.entries(criterios).filter(([, valor]) => valor);
  return <>
    <SearchBar key={getCatalogUrl(criterios)} titulo={titulo} criterios={criterios} sedes={catalogo.sedes} sugerencias={catalogo.sugerencias} />
    <section className={`contenido ${styles.catalogo}`} aria-label="Resultados de la búsqueda">
      <FilterDialog key={getCatalogUrl(criterios)} criterios={criterios} filtros={filtros} total={total}><DisciplineBar criterios={criterios} /></FilterDialog>
      <div className={styles.estado}>
        <p className={styles.cuenta} data-total>{total} {total === 1 ? "laboratorio" : "laboratorios"}</p>
        {activos.length > 0 && <div className={styles.activos}>{activos.map(([eje, valor]) => <ActiveChip key={eje} href={getCatalogUrl(criterios, { [eje]: "" })} etiqueta={eje} valor={eje === "tipo" ? redes[valor as TipoLaboratorio].nombre : etiquetas[`${eje}:${valor}`] ?? valor!} />)}<Link href="/laboratorios">Limpiar todo</Link></div>}
      </div>
      {total ? <div className={styles.reticula}>{resultados.map((lab, i) => <LaboratoryCard prioritaria={i === 0} key={lab.idLab} laboratorio={lab} coincidencias={lab.coincidencias} busqueda={criterios.q} foto={getPhotos(lab.idLab, fotos, lab.grupos)[0]} />)}</div> : <div className={styles["catalogo-vacio"]}>
        <h2 className={styles["catalogo-vacio-titulo"]}>Ningún laboratorio coincide con esta búsqueda</h2>
        <p className={styles["catalogo-vacio-texto"]}>Prueba con otras palabras, cambia de disciplina o quita algún filtro.</p>
        <Link className={styles["catalogo-vacio-accion"]} href="/laboratorios">Quitar los filtros</Link>
      </div>}
      <LaboratoryDialog />
    </section>
  </>;
}
