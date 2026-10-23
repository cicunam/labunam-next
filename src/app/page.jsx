// LabUNAM
// Páginas
// Portada (/)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Servicios
import { getSearchOptions, countLaboratorios } from "@/server/laboratorios/laboratoriosService";
// «Recién incorporados» está comentado; si vuelve, se restauran estas importaciones.
// import { getRecentLaboratorios } from "@/server/laboratorios/laboratoriosService";
// import { readPhotos } from "@/server/fotos/fotosService";

// Componentes (secciones de la portada)
import {
  SearchBar,
  LaboratoryNetworks,
  // RecentLaboratories,
  DisciplineSection,
  NewsSection,
  LaboratoryMap,
  About,
  LaboratoryDialog,
} from "@/components";

// Configuración de Next
export const dynamic = "force-dynamic";

// Definición de la página
// No recibe props: los datos salen del servicio de laboratorios (el de fotos sólo lo usa
// «Recién incorporados», que está comentado).
const HomePage = async () => {
  // Datos
  // Sin «Recién incorporados» no se consultan los recientes ni sus fotos.
  const [{ locations, suggestions }, counts] = await Promise.all([
    getSearchOptions(),
    countLaboratorios(),
    // getRecentLaboratorios(4),
    // readPhotos(),
  ]);

  // Interfaz
  return (
    <>
      <SearchBar
        title="Encuentra el laboratorio que necesitas"
        locations={locations}
        suggestions={suggestions}
        popularSearches={["Microscopía", "Rayos X", "Cromatografía"]}
      />

      <LaboratoryNetworks counts={counts.tipos} />
      {/* «Recién incorporados» queda comentado mientras se decide en reunión si se elimina el
          código o se conserva. Para restaurarlo, quitar los comentarios de este bloque, de la
          consulta de recientes y fotos en «Datos» y de sus importaciones.
      <RecentLaboratories
        recentLaboratorios={recentLaboratorios}
        photos={photos}
        total={counts.total}
      />
      */}

      <DisciplineSection areaCounts={counts.areas} />
      <LaboratoryMap locations={locations} />
      <NewsSection />
      <About />
      <LaboratoryDialog />
    </>
  );
};

export default HomePage;
