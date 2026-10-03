import Link from "next/link";
import { cargarCatalogo } from "@/lib/catalogo";
import { filtrar, normalizarCriterios } from "@/lib/buscador";
import { prepararFiltros } from "@/lib/filtros";
import { fotosDe, leerFotos } from "@/lib/fotos";
import { redes, urlCatalogo } from "@/lib/presentacion";
import type { Criterios, TipoLaboratorio } from "@/lib/tipos";
import { Buscador } from "@/components/organisms/Buscador";
import { ModalFiltros } from "@/components/organisms/ModalFiltros";
import { TiraDisciplinas } from "@/components/organisms/TiraDisciplinas";
import { Tarjeta } from "@/components/organisms/Tarjeta";
import { Ficha } from "@/components/organisms/Ficha";
import { ChipActivo } from "@/components/molecules/ChipActivo";
import styles from "../Laboratorios.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Laboratorios" };
export default async function Laboratorios({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const parametros = await searchParams;
  const [catalogo, fotos] = await Promise.all([cargarCatalogo(), leerFotos()]);
  const criterios = normalizarCriterios(catalogo.laboratorios, Object.fromEntries(Object.entries(parametros).filter(([, v]) => typeof v === "string")) as Criterios);
  const resultados = filtrar(catalogo.laboratorios, criterios);
  const { filtros, total } = prepararFiltros(catalogo, criterios);
  const titulo = criterios.tipo ? redes[criterios.tipo as TipoLaboratorio].nombre : "Laboratorios de la UNAM";
  const etiquetas = Object.fromEntries(filtros.flatMap((filtro) => filtro.opciones.map((o) => [`${filtro.eje}:${o.clave}`, o.etiqueta])));
  const activos = Object.entries(criterios).filter(([, valor]) => valor);
  return <>
    <Buscador key={urlCatalogo(criterios)} titulo={titulo} criterios={criterios} sedes={catalogo.sedes} sugerencias={catalogo.sugerencias} />
    <section className={`contenido ${styles.catalogo}`} aria-label="Resultados de la búsqueda">
      <ModalFiltros key={urlCatalogo(criterios)} criterios={criterios} filtros={filtros} total={total}><TiraDisciplinas criterios={criterios} /></ModalFiltros>
      <div className={styles.estado}>
        <p className={styles.cuenta} data-total>{total} {total === 1 ? "laboratorio" : "laboratorios"}</p>
        {activos.length > 0 && <div className={styles.activos}>{activos.map(([eje, valor]) => <ChipActivo key={eje} href={urlCatalogo(criterios, { [eje]: "" })} etiqueta={eje} valor={eje === "tipo" ? redes[valor as TipoLaboratorio].nombre : etiquetas[`${eje}:${valor}`] ?? valor!} />)}<Link href="/laboratorios">Limpiar todo</Link></div>}
      </div>
      {total ? <div className={styles.reticula}>{resultados.map((lab) => <Tarjeta key={lab.idLab} laboratorio={{ ...lab, servicios: lab.servicios.length, equipos: lab.equipos.length }} foto={fotosDe(lab.idLab, fotos)[0]} />)}</div> : <div className={styles["catalogo-vacio"]}>
        <h2 className={styles["catalogo-vacio-titulo"]}>Ningún laboratorio coincide con esta búsqueda</h2>
        <p className={styles["catalogo-vacio-texto"]}>Prueba con otras palabras, cambia de disciplina o quita algún filtro.</p>
        <Link className={styles["catalogo-vacio-accion"]} href="/laboratorios">Quitar los filtros</Link>
      </div>}
      <Ficha />
    </section>
  </>;
}
