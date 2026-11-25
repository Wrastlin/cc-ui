import type { Preview } from "@storybook/nextjs-vite";
import "./catalog.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true, navigation: { pathname: "/production" } },
    a11y: { test: "error" },
    controls: { expanded: true },
  },
};

export default preview;
