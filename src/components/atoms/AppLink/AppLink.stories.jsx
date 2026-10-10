import { AppLink } from "./AppLink";

const meta = {
  title: "Átomos/AppLink",
  component: AppLink,
  args: { href: "/laboratorios", children: "Ver laboratorios" },
};
export default meta;
export const Interno = {};
export const Externo = {
  args: {
    href: "https://www.unam.mx/",
    children: "Universidad Nacional Autónoma de México",
    target: "_blank",
    rel: "noopener",
  },
};
