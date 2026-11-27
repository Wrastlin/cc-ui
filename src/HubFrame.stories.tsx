import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HubFrame } from "./HubFrame";

const apps = ["dashboard", "production", "checks", "estimating", "subcontracts"];

const meta = {
  title: "Shell/HubFrame",
  parameters: { layout: "fullscreen" },
  beforeEach: () => {
    const real = window.fetch;
    window.fetch = (input, init) =>
      String(input).endsWith("/api/menu")
        ? Promise.resolve(new Response(JSON.stringify({ apps }), { headers: { "content-type": "application/json" } }))
        : real(input, init);
    return () => {
      window.fetch = real;
    };
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <HubFrame basePath="" path="/production">
      <h1 style={{ margin: 16 }}>Production</h1>
    </HubFrame>
  ),
};
