import Icon from "./Icon";

const meta = {
  title: "Átomos/Icon",
  component: Icon,
  args: { nombre: "biologia", etiqueta: "Biología" },
};
export default meta;
export const Biologia = {};
export const Areas = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, maxWidth: 600 }}>
      {[
        "todas",
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
      ].map((nombre) => (
        <Icon
          key={nombre}
          nombre={nombre}
          etiqueta={nombre}
        />
      ))}
    </div>
  ),
};
