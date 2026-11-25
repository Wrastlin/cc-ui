import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Button from "./Button";
import Sheet from "./Sheet";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  parameters: { layout: "fullscreen" },
  args: { open: true, onClose: fn(), title: "PO note", children: <p>Driver left 2 bundles at the gate.</p> },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = { args: { placement: "bottom" } };
export const Center: Story = { args: { placement: "center" } };
export const WithFooter: Story = { args: { footer: <Button variant="primary" block>Save</Button> } };
