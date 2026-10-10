import RecentLaboratories from "./RecentLaboratories";

const meta = {
  title: "Organismos/RecentLaboratories",
  component: RecentLaboratories,
  parameters: { layout: "fullscreen" },
};
export default meta;
const Default = { args: { recentLaboratorios: [], photos: {}, total: 0 } };
export { Default };
