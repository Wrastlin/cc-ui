import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Camera, ChevronRight, Plus } from "lucide-react";
import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
  title: "Parts/Button",
  component: Button,
  args: { children: "Save", onClick: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Ghost: Story = { args: { variant: "ghost", children: "More" } };
export const Text: Story = { args: { variant: "text", children: "Show all" } };
export const Danger: Story = { args: { variant: "danger", children: "Remove" } };
export const Small: Story = { args: { size: "sm", children: "Add" } };
export const Large: Story = { args: { size: "lg", children: "Approve" } };
export const WithIcon: Story = { args: { icon: <Plus size={16} aria-hidden />, children: "New PO" } };
export const WithTrailing: Story = { args: { trailing: <ChevronRight size={16} aria-hidden />, children: "Next" } };
export const IconOnly: Story = { args: { icon: <Camera size={18} aria-hidden />, children: undefined, title: "Photo" } };
export const Block: Story = { args: { block: true, children: "Received" } };
export const Disabled: Story = { args: { disabled: true } };
export const Pressed: Story = { args: { variant: "secondary", pressed: true, children: "Open" } };
export const AsLink: Story = { args: { href: "/receiving", children: "Receiving" } as never };
