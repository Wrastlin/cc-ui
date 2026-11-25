import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Button from "./Button";
import Card from "./Card";

const meta = { title: "Layout/Card", component: Card, args: { title: "PO-00058", sub: "Manion's, 9 lines" } } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: <p>Delivered 11/25.</p> } };
export const WithAction: Story = { args: { action: <Button variant="primary">Open</Button>, children: <p>Delivered 11/25.</p> } };
export const WithMore: Story = {
  args: { action: <Button variant="primary">Open</Button>, more: [{ id: "print", label: "Print", onAction: fn() }], children: <p>Delivered 11/25.</p> },
};
