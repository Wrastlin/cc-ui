import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";
import { OverlayBar } from "./OverlayBar";

const meta = {
  title: "Shell/OverlayBar",
  component: OverlayBar,
  parameters: { layout: "fullscreen" },
  decorators: [(S) => <div style={{ position: "relative", height: 120, background: "#556" }}><S /></div>],
} satisfies Meta<typeof OverlayBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { back: { label: "Shop", href: "/shop" } } };
export const WithRight: Story = { args: { back: { label: "Shop", href: "/shop" }, right: <Button size="sm">Done</Button> } };
