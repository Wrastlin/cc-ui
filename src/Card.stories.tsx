import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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

/** Polaris card layout: the list action left, at most two calls right, the rest in More. */
export const WithFooter: Story = {
  args: {
    title: "Downspouts",
    sub: "3 on the job",
    children: <p>Front left, front right, back corner.</p>,
    footer: {
      list: <Button variant="text" size="sm">Add downspout</Button>,
      calls: [<Button key="s">Order</Button>, <Button key="p" variant="primary">Approve</Button>],
      more: [{ id: "print", label: "Print", onAction: fn() }],
    },
  },
};

/** A long list shows five, then Show more in the footer. */
export const Collapsed: Story = {
  args: {
    title: "Open lines",
    sub: "PO-00058",
    collapseAfter: 5,
    children: Array.from({ length: 12 }, (_, i) => <p key={i} style={{ margin: 0 }}>Line {i + 1}: 3 by 4 downspout, White</p>),
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByText(/Line 6:/)).toBeNull();
    await userEvent.click(c.getByRole("button", { name: "Show 7 more" }));
    await expect(c.getByText(/Line 12:/)).toBeInTheDocument();
    await userEvent.click(c.getByRole("button", { name: "Show fewer" }));
    (document.activeElement as HTMLElement | null)?.blur();
  },
};
