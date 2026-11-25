import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { BackButton } from "./BackButton";

const meta = { title: "Parts/BackButton", component: BackButton } satisfies Meta<typeof BackButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Link: Story = { args: { label: "Open POs", href: "/receiving" } };
export const Action: Story = { args: { label: "Back", onClick: fn() } };
export const LongLabel: Story = { args: { label: "PO-00058 Manion's Wholesale, Terratone trim", href: "/r" } };
