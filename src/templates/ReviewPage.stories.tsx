import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import Row, { RowGroup } from "../Row";
import { nextOpen } from "../review";
import ReviewPage from "./ReviewPage";

type Invoice = { id: string; name: string; done: boolean; lines: [string, number, number][] };
const pile: Invoice[] = [
  { id: "4471", name: "Manion's invoice 4471", done: false, lines: [["Timberline HDZ Charcoal", 42, 42], ["Drip edge 10 ft", 30, 28]] },
  { id: "9902", name: "ABC Supply invoice 9902", done: true, lines: [["Ice and water 2 sq", 8, 8]] },
  { id: "4480", name: "Manion's invoice 4480", done: false, lines: [["Pro-Start starter", 6, 6]] },
];

function Original({ name }: { name: string }) {
  return (
    <div style={{ aspectRatio: "8.5 / 11", border: "1px solid var(--cc-line)", borderRadius: 6, padding: 16, color: "var(--cc-muted)" }}>
      {name}.pdf
    </div>
  );
}

function Demo({ start }: { start: number }) {
  const [items, setItems] = useState(pile);
  const [i, setI] = useState(start);
  const it = items[i];
  const left = items.filter((x) => !x.done).length;
  return (
    <ReviewPage
      title={it.name}
      status={<span style={{ color: "var(--cc-muted)" }}>{it.done ? "Approved" : "Open"}</span>}
      listTitle="All invoices"
      list={
        <RowGroup label="Invoices">
          {items.map((x, k) => (
            <Row key={x.id} title={x.name} sub={x.done ? "Approved" : "Open"} current={k === i} onClick={() => setI(k)} />
          ))}
        </RowGroup>
      }
      document={<Original name={it.name} />}
      pager={{
        back: { label: "Invoices", href: "#" },
        at: i + 1,
        total: items.length,
        noun: "invoice",
        onPrev: i > 0 ? () => setI(i - 1) : null,
        onNext: i < items.length - 1 ? () => setI(i + 1) : null,
        decision: it.done
          ? undefined
          : {
              label: "Approve",
              left,
              onPress: () => {
                const next = items.map((x, k) => (k === i ? { ...x, done: true } : x));
                setItems(next);
                const n = nextOpen(next, i, (x) => !x.done);
                if (n >= 0) setI(n);
              },
            },
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "right" }}>On PO</th>
            <th style={{ textAlign: "right" }}>Billed</th>
          </tr>
        </thead>
        <tbody>
          {it.lines.map(([n, po, billed]) => (
            <tr key={n}>
              <td>{n}</td>
              <td style={{ textAlign: "right" }}>{po}</td>
              <td style={{ textAlign: "right" }}>{billed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReviewPage>
  );
}

const meta = { title: "Pages/ReviewPage", component: Demo, args: { start: 0 } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** One invoice in hand: pager and decision in its header, lines to match, the original as is. Desk: the jump list on
 * the left and the original beside the lines. Phone: one column, the list behind All invoices. */
export const FirstOfMany: Story = {};

/** The last one: Next is off. */
export const LastItem: Story = { args: { start: 2 } };

/** Approve moves to the next open invoice, skipping the one already approved. */
export const AfterDecisionNextOpen: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Approve, 2 left" }));
    await expect(c.getByRole("heading", { level: 1, name: "Manion's invoice 4480" })).toBeInTheDocument();
    await expect(c.getByText("3 of 3")).toBeInTheDocument();
  },
};
