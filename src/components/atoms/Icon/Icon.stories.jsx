import Icon from "./Icon";

const meta = {
  title: "Átomos/Icon",
  component: Icon,
  args: { name: "biologia", label: "Biología" },
};
export default meta;
export const Biologia = {};
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
