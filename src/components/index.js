// Punto de entrada para páginas y layouts. Sin "use client": cada componente conserva su frontera.
// Entre componentes usamos imports directos para evitar dependencias circulares.

// Átomos
export { default as AppLink } from "./atoms/AppLink/AppLink";
export { default as Badge } from "./atoms/Badge/Badge";
export { default as Button } from "./atoms/Button/Button";
export { default as Icon } from "./atoms/Icon/Icon";
export { default as Input } from "./atoms/Input/Input";
export { default as Pill } from "./atoms/Pill/Pill";

// Moléculas
export { default as ActiveChip } from "./molecules/ActiveChip/ActiveChip";
export { default as FilterOption } from "./molecules/FilterOption/FilterOption";
export { default as Gallery } from "./molecules/Gallery/Gallery";
export { default as SearchField } from "./molecules/SearchField/SearchField";
export { default as Tab } from "./molecules/Tab/Tab";

// Organismos
export { default as About } from "./organisms/About/About";
export { default as Carousel } from "./organisms/Carousel/Carousel";
export { default as Contact } from "./organisms/Contact/Contact";
export { default as DisciplineBar } from "./organisms/DisciplineBar/DisciplineBar";
export { default as DisciplineSection } from "./organisms/DisciplineSection/DisciplineSection";
export { default as FilterDialog } from "./organisms/FilterDialog/FilterDialog";
export { default as Footer } from "./organisms/Footer/Footer";
export { default as Header } from "./organisms/Header/Header";
export { default as LaboratoryCard } from "./organisms/LaboratoryCard/LaboratoryCard";
export { default as LaboratoryDetails } from "./organisms/LaboratoryDetails/LaboratoryDetails";
export { default as LaboratoryDialog } from "./organisms/LaboratoryDialog/LaboratoryDialog";
export { default as LaboratoryMap } from "./organisms/LaboratoryMap/LaboratoryMap";
export { default as LaboratoryNetworks } from "./organisms/LaboratoryNetworks/LaboratoryNetworks";
export { default as NewsSection } from "./organisms/NewsSection/NewsSection";
export { default as RecentLaboratories } from "./organisms/RecentLaboratories/RecentLaboratories";
export { default as SearchBar } from "./organisms/SearchBar/SearchBar";
