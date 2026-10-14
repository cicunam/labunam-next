// LabUNAM
// Historias
// Icon.stories (iconos de las áreas de conocimiento)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import Icon from "./Icon";

// Configuración de la historia
const meta = {
  title: "Átomos/Icon",
  component: Icon,
  args: { name: "biologia", label: "Biología" },
};
export default meta;

// Historias
// Icono de una sola área, Biología
export const Biologia = {};
// Todos los iconos de área juntos, incluido el general
export const Areas = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, maxWidth: 600 }}>
      {[
        "all",
        "biologia",
        "salud",
        "quimica",
        "fisica",
        "materiales",
        "computo",
        "tierra",
        "ingenieria",
        "sostenibilidad",
        "humanidades",
      ].map((name) => (
        <Icon
          key={name}
          name={name}
          label={name}
        />
      ))}
    </div>
  ),
};
