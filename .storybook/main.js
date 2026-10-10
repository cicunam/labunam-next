import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

const config = {
  stories: ["../src/components/**/*.stories.jsx"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/nextjs-vite",
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
    });
  },
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
};
export default config;
