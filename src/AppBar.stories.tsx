import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus } from "lucide-react";
import { fn } from "storybook/test";
import { AccountButton } from "./AccountButton";
import { AppBar, IdentityBar } from "./AppBar";

const meta = {
  title: "Shell/AppBar",
  component: AppBar,
  parameters: { layout: "fullscreen" },
  args: { product: { name: "Receiving", href: "/receiving" }, hubHref: "/" },
} satisfies Meta<typeof AppBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBack: Story = { args: { back: { label: "Open POs", href: "/receiving" } } };
export const WithAction: Story = {
  args: { action: { label: "New", icon: <Plus size={16} aria-hidden />, onClick: fn(), variant: "primary" } },
};
export const WithAccount: Story = { args: { account: <AccountButton email="pat.lee@example.com" /> } };
export const Identity: StoryObj = { render: () => <IdentityBar /> };
