import SearchBar from "./SearchBar";

const meta = {
  title: "Organismos/SearchBar",
  component: SearchBar,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Encuentra el laboratorio que necesitas",
    locations: [{ clave: "ciudad-de-mexico", etiqueta: "Ciudad de México", total: 3 }],
    suggestions: ["Microscopía", "Microscopía óptica", "Rayos X"],
    popularSearches: ["Microscopía", "Rayos X"],
  },
};
export default meta;
const Default = {};
export { Default };
