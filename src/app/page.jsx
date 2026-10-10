// LabUNAM
// Páginas
// Portada (/)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Servicios
import { getHomeData } from "@/server/home/homeService";

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
// No recibe props: todo sale de getHomeData.
const HomePage = async () => {
  // Datos
  const { locations, suggestions, counts, areaCounts, recentLaboratorios, photos, total } =
    await getHomeData();

  // Interfaz
  return (
    <>
      <SearchBar
        title="Encuentra el laboratorio que necesitas"
        locations={locations}
        suggestions={suggestions}
        popularSearches={["Microscopía", "Rayos X", "Cromatografía"]}
      />

      <LaboratoryNetworks counts={counts} />
      <RecentLaboratories
        recentLaboratorios={recentLaboratorios}
        photos={photos}
        total={total}
      />

      <DisciplineSection areaCounts={areaCounts} />
      <LaboratoryMap locations={locations} />
      <NewsSection />
      <About />
      <LaboratoryDialog />
    </>
  );
};

export default HomePage;
