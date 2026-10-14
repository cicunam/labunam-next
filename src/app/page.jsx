// LabUNAM
// Páginas
// Portada (/)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Servicios
import {
  getSearchOptions,
  countLaboratorios,
  getRecentLaboratorios,
} from "@/server/laboratorios/laboratoriosService";
import { readPhotos } from "@/server/fotos/fotosService";

// Componentes (secciones de la portada)
import {
  SearchBar,
  LaboratoryNetworks,
  RecentLaboratories,
  DisciplineSection,
  NewsSection,
  LaboratoryMap,
  About,
  LaboratoryDialog,
} from "@/components";

// Configuración de Next
export const dynamic = "force-dynamic";

// Definición de la página
// No recibe props: los datos salen de los servicios de laboratorios y fotos.
const HomePage = async () => {
  // Datos
  const [{ locations, suggestions }, counts, recentLaboratorios, photos] = await Promise.all([
    getSearchOptions(),
    countLaboratorios(),
    getRecentLaboratorios(4),
    readPhotos(),
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
      <RecentLaboratories
        recentLaboratorios={recentLaboratorios}
        photos={photos}
        total={counts.total}
      />

      <DisciplineSection areaCounts={counts.areas} />
      <LaboratoryMap locations={locations} />
      <NewsSection />
      <About />
      <LaboratoryDialog />
    </>
  );
};

export default HomePage;
