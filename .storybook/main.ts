import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx", "../gallery/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest", "@storybook/addon-mcp"],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  core: { disableTelemetry: true },
  viteFinal: (c) => ({ ...c, plugins: [...(c.plugins ?? []), tailwindcss()] }),
};

export default config;
