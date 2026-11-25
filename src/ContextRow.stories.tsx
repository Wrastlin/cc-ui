import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumbs, Chip, RecordRow, TabRow } from "./ContextRow";

const meta = { title: "Parts/ContextRow", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Tabs: Story = {
  render: () => (
    <TabRow
      tabs={[
        { label: "Open", href: "/receiving", count: 12, current: true },
        { label: "Received", href: "/receiving/received", count: 40 },
      ]}
    />
  ),
};
export const Record: Story = {
  render: () => <RecordRow title="Jordan Smith" sub="1200 Oak Street, Siding" status={<Chip tone="good">Open</Chip>} />,
};
export const Chips: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Chip>Neutral</Chip>
      <Chip tone="accent">Accent</Chip>
      <Chip tone="good">Good</Chip>
      <Chip tone="warn">Warn</Chip>
      <Chip tone="danger">Danger</Chip>
    </div>
  ),
};
export const Crumbs: Story = {
  render: () => <Breadcrumbs crumbs={[{ label: "Receiving", href: "/receiving" }, { label: "PO-00052" }]} />,
};
