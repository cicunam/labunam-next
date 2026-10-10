import LaboratoryDetails from "./LaboratoryDetails";
import { laboratorio } from "../fixtures/organismos.fixtures";

const meta = {
  title: "Organismos/LaboratoryDetails",
  component: LaboratoryDetails,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, margin: "auto" }}>
        <Story />
      </div>
    ),
  ],

  args: { laboratorio, isPage: true },
};
export default meta;
const Default = {};
export { Default };
