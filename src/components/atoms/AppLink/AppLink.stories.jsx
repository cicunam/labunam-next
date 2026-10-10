import AppLink from "./AppLink";

const meta = {
  title: "Átomos/AppLink",
  component: AppLink,
  args: { href: "/laboratorios", children: "Ver laboratorios" },
};
export default meta;
const Internal = {};
export { Internal };
const External = {
  args: {
    href: "https://www.unam.mx/",
    children: "Universidad Nacional Autónoma de México",
    target: "_blank",
    rel: "noopener",
  },
};
export { External };
