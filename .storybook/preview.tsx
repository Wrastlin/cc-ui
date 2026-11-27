import type { Preview } from "@storybook/nextjs-vite";
import "./catalog.css";

const preview: Preview = {
  globalTypes: {
    ccStyle: {
      description: "Style option",
      toolbar: {
        title: "Style",
        icon: "paintbrush",
        dynamicTitle: true,
        items: [
          { value: "crisp", title: "Crisp (now)" },
          { value: "1031", title: "10/31 (before)" },
          { value: "field", title: "Field" },
          { value: "warm", title: "Warm" },
        ],
      },
    },
  },
  initialGlobals: { ccStyle: "crisp" },
  decorators: [
    (Story, ctx) => {
      document.documentElement.dataset.ccStyle = ctx.globals.ccStyle ?? "crisp";
      return <Story />;
    },
  ],
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true, navigation: { pathname: "/production" } },
    a11y: { test: "error" },
    controls: { expanded: true },
  },
};

export default preview;
