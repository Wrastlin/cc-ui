import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Camera, Check, MoreHorizontal, Truck } from "lucide-react";
import Icon from "./Icon";
import Button from "./Button";

const meta = { title: "Primitives/Icon" } satisfies Meta;
export default meta;
type Story = StoryObj;

/** The three sizes beside body text, one stroke. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, fontSize: "var(--cc-fs-body)", color: "var(--cc-text)" }}>
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon icon={Truck} size="text" /> Received Tuesday</span>
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon icon={Camera} size="control" /> Inside a control</span>
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon icon={Check} size="display" /> Display</span>
    </div>
  ),
};

/** Alone in a control it carries the name; beside a word it is hidden. */
export const InButtons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="secondary" icon={<Icon icon={Camera} />}>Add photo</Button>
      <Button variant="ghost" icon={<Icon icon={MoreHorizontal} />} aria-label="More" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("button", { name: "Add photo" })).toBeInTheDocument();
    await expect(c.getByRole("button", { name: "More" })).toBeInTheDocument();
    for (const svg of canvasElement.querySelectorAll("svg.ui-icon")) await expect(svg.getAttribute("stroke-width")).toBe("1.75");
  },
};
