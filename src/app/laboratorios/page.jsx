// LabUNAM
// Páginas
// Catálogo de laboratorios (/laboratorios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import Link from "next/link";
import { getPhotos } from "@/lib/fotos/fotos";
import { redes, getCatalogUrl } from "@/lib/presentacion/presentacion";

// Servicios
import { searchCatalog } from "@/server/catalogo/catalogoSearchService";

// Componentes
import {
  SearchBar,
  FilterDialog,
  DisciplineBar,
  LaboratoryCard,
  LaboratoryDialog,
  ActiveChip,
} from "@/components";

// Estilos
import styles from "./Laboratorios.module.css";

// Configuración de Next
export const dynamic = "force-dynamic";
export const metadata = { title: "Laboratorios" };

// Definición de la página
const LaboratoriesPage = async ({
  searchParams, // Promise - Resuelve al objeto con los parámetros de la URL (q, tipo, disciplina, sede…)
}) => {
  // Datos
  const {
    criteria,
    results,
    filters: filtros,
    total,
    locations,
    suggestions,
    photos,
  } = await searchCatalog(await searchParams);

  // Preparación de datos
  const title = criteria.tipo ? redes[criteria.tipo].nombre : "Laboratorios de la UNAM";
  const labels = Object.fromEntries(
    filtros.flatMap((filtro) =>
      filtro.opciones.map((o) => [`${filtro.eje}:${o.clave}`, o.etiqueta]),
    ),
  );
  const activeFilters = Object.entries(criteria).filter(([, value]) => value);

  // Interfaz
  return (
    <>
      <SearchBar
        key={getCatalogUrl(criteria)}
        title={title}
        criteria={criteria}
        locations={locations}
        suggestions={suggestions}
      />

      <section
        className={`content ${styles.catalog}`}
        aria-label="Resultados de la búsqueda"
      >
        <FilterDialog
          key={getCatalogUrl(criteria)}
          criteria={criteria}
          filters={filtros}
          total={total}
        >
          <DisciplineBar criteria={criteria} />
        </FilterDialog>
        <div className={styles.status}>
          <p
            className={styles.count}
            data-total
          >
            {total} {total === 1 ? "laboratorio" : "laboratorios"}
          </p>
          {activeFilters.length > 0 && (
            <div className={styles.active}>
              {activeFilters.map(([eje, value]) => (
                <ActiveChip
                  key={eje}
                  href={getCatalogUrl(criteria, { [eje]: "" })}
                  label={eje}
                  value={
                    eje === "tipo" ? redes[value].nombre : (labels[`${eje}:${value}`] ?? value)
                  }
                />
              ))}
              <Link href="/laboratorios">Limpiar todo</Link>
            </div>
          )}
        </div>
        {total ? (
          <div className={styles.grid}>
            {results.map((lab, i) => (
              <LaboratoryCard
                priority={i === 0}
                key={lab.idLab}
                laboratorio={lab}
                matches={lab.coincidencias}
                query={criteria.q}
                photo={getPhotos(lab.idLab, photos, lab.grupos)[0]}
              />
            ))}
          </div>
        ) : (
          <div className={styles["catalog-empty"]}>
            <h2 className={styles["catalog-empty-title"]}>
              Ningún laboratorio coincide con esta búsqueda
            </h2>
            <p className={styles["catalog-empty-text"]}>
              Prueba con otras palabras, cambia de disciplina o quita algún filtro.
            </p>
            <Link
              className={styles["catalog-empty-action"]}
              href="/laboratorios"
            >
              Quitar los filtros
            </Link>
          </div>
        )}
        <LaboratoryDialog />
      </section>
    </>
  );
};

export default LaboratoriesPage;
