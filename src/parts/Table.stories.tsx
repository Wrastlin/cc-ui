import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Table } from "./Table";

const meta = { title: "Tailwind parts/Table" } satisfies Meta;
export default meta;
type Story = StoryObj;

type Line = { id: string; item: string; qty: number; unit: string; trade: string };
const lines: Line[] = [
  { id: "1", item: "Architectural shingles, Charcoal", qty: 32, unit: "bundles", trade: "Roofing" },
  { id: "2", item: "Synthetic underlayment, 10 square roll", qty: 4, unit: "rolls", trade: "Roofing" },
  { id: "3", item: "6 inch K-style gutter, White", qty: 140, unit: "feet", trade: "Gutters" },
  { id: "4", item: "Ridge vent with an external baffle, the long name wraps instead of cutting off", qty: 9, unit: "pieces", trade: "Roofing" },
];
export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<SortDescriptor>({ column: "item", direction: "ascending" });
    const rows = [...lines].sort((a, b) => {
      const k = sort.column as keyof Line;
      const d = a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0;
      return sort.direction === "descending" ? -d : d;
    });
    return (
      <Table<Line>
        aria-label="Material lines"
        columns={[
          { id: "item", label: "Item", isRowHeader: true, allowsSorting: true },
          { id: "trade", label: "Trade", allowsSorting: true },
          { id: "qty", label: "Quantity", align: "end", allowsSorting: true, render: (r) => `${r.qty} ${r.unit}` },
        ]}
        rows={rows}
        sortDescriptor={sort}
        onSortChange={setSort}
      />
    );
  },
};
export const Empty: Story = {
  render: () => <Table<Line> aria-label="Empty lines" columns={[{ id: "item", label: "Item", isRowHeader: true }]} rows={[]} emptyText="No material lines" />,
};
