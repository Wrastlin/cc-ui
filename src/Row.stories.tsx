import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronRight, Package } from "lucide-react";
import { fn } from "storybook/test";
import Row, { RowGroup } from "./Row";

const meta = { title: "Rows/Row", component: Row } satisfies Meta<typeof Row>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Link: Story = { args: { href: "/receiving/po-52", title: "PO-00052", sub: "Manion's, 14 lines", trailing: <ChevronRight size={16} aria-hidden /> } };
export const Action: Story = { args: { onClick: fn(), title: "Add photos", icon: <Package size={18} aria-hidden /> } };
export const Plain: Story = { args: { title: "No supplier" } };
export const LongText: Story = {
  args: {
    href: "/x",
    title: "James Hardie HardiePlank Lap Siding 8.25 in Select Cedarmill ColorPlus Arctic White",
    sub: "1200 Oak Street, Lincoln, Nebraska, second floor gable and dormers",
    trailing: "14",
  },
};
export const Group: StoryObj = {
  render: () => (
    <RowGroup label="Open POs">
      <Row href="/1" title="PO-00052" sub="Manion's" trailing="14" />
      <Row href="/2" title="PO-00053" sub="ABC Supply" trailing="3" />
      <Row href="/3" title="PO-00057" sub="SRS" trailing="8" />
    </RowGroup>
  ),
};
