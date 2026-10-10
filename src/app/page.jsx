// Datos del servidor
import { loadCatalog } from "@/lib/catalogo/catalogo";
import { countFacet } from "@/lib/buscador/buscador";
import { readPhotos } from "@/lib/fotos/fotos";
import { grupos } from "@/lib/grupos/grupos";
import { homeNetworks } from "@/lib/home/homeContent";

// Secciones de la portada
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

export const dynamic = "force-dynamic";

const HomePage = async () => {
  // Los conteos y las fotos se preparan en servidor; el cliente recibe sólo lo que muestra.
  const [catalogo, photos] = await Promise.all([loadCatalog(), readPhotos()]);
  const tipos = homeNetworks.map(({ tipo }) => tipo);
  const counts = countFacet(catalogo.laboratorios, {}, "tipo", tipos);
  const areas = countFacet(
    catalogo.laboratorios,
    {},
    "disciplina",
    grupos.map((grupo) => grupo.clave),
  );
  const recentSearches = [...catalogo.laboratorios]
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idLab - a.idLab)
    .slice(0, 4);

  return (
    <>
      <SearchBar
        title="Encuentra el laboratorio que necesitas"
        locations={catalogo.sedes}
        suggestions={catalogo.sugerencias}
        popularSearches={["Microscopía", "Rayos X", "Cromatografía"]}
      />

      <LaboratoryNetworks counts={counts} />
      <RecentLaboratories
        recentLaboratorios={recentSearches}
        photos={photos}
        total={catalogo.laboratorios.length}
      />

      <DisciplineSection areaCounts={areas} />
      <LaboratoryMap locations={catalogo.sedes} />
      <NewsSection />
      <About />
      <LaboratoryDialog />
    </>
  );
};

export default HomePage;
