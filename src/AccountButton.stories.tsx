import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { AccountButton } from "./AccountButton";

const meta = {
  title: "Parts/AccountButton",
  component: AccountButton,
  args: { email: "pat.lee@example.com", onSignOut: fn() },
  decorators: [(S) => <div style={{ display: "flex", justifyContent: "flex-end" }}><S /></div>],
} satisfies Meta<typeof AccountButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithItems: Story = {
  args: { items: [{ label: "Settings", href: "/settings" }, { label: "Remove device", danger: true, onClick: fn() }] },
};
export const NoEmail: Story = { args: { email: undefined } };
