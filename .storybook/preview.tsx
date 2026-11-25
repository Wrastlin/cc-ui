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
          { value: "1031", title: "10/31 (now)" },
          { value: "crisp", title: "Crisp" },
          { value: "field", title: "Field" },
          { value: "warm", title: "Warm" },
        ],
      },
    },
  },
  initialGlobals: { ccStyle: "1031" },
  decorators: [
    (Story, ctx) => {
      document.documentElement.dataset.ccStyle = ctx.globals.ccStyle ?? "1031";
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
