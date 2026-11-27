import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Button from "../Button";
import Row, { RowGroup } from "../Row";
import { EmptyState } from "../States";
import { ToastHost, toast } from "../Toast";
import WorklistPage, { type WorklistView } from "./WorklistPage";

type Line = { id: string; name: string; qty: number; done: boolean };
const lines: Line[] = [
  { id: "1", name: "GAF Timberline HDZ Charcoal", qty: 42, done: false },
  { id: "2", name: "GAF Pro-Start starter strip", qty: 6, done: false },
  { id: "3", name: "Ice and water shield 2 sq", qty: 8, done: true },
  { id: "4", name: "Drip edge 10 ft white", qty: 30, done: false },
];

function Demo({ start, all }: { start: WorklistView; all?: boolean }) {
  const [items, setItems] = useState(all ? lines.map((l) => ({ ...l, done: true })) : lines);
  const [view, setView] = useState<WorklistView>(start);
  const open = items.filter((l) => !l.done);
  const done = items.filter((l) => l.done);
  const set = (id: string, d: boolean) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: d } : x)));
  const shown = view === "open" ? open : done;
  return (
    <>
      <WorklistPage
        back={{ label: "Receiving", href: "#" }}
        title="Manion's PO-00052"
        view={view}
        onView={setView}
        counts={{ open: open.length, done: done.length }}
        labels={{ open: "Open", done: "Received" }}
        action={<Button variant="secondary">Print the PO</Button>}
      >
        {shown.length === 0 ? (
          <EmptyState text={view === "open" ? "Everything on this PO is received." : "Nothing received yet."} />
        ) : (
          <RowGroup label={view === "open" ? "Open lines" : "Received lines"}>
            {shown.map((l) => (
              <Row
                key={l.id}
                title={l.name}
                trailing={<span style={{ fontVariantNumeric: "tabular-nums" }}>{l.qty}</span>}
                onClick={
                  view === "open"
                    ? () => {
                        set(l.id, true);
                        toast(`${l.name} received`, { undo: () => set(l.id, false) });
                      }
                    : undefined
                }
              />
            ))}
          </RowGroup>
        )}
      </WorklistPage>
      <ToastHost />
    </>
  );
}

const meta = { title: "Pages/WorklistPage", component: Demo, args: { start: "open" } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Open holds only what is left, in the PO's order; the counts ride on the views. */
export const OpenTab: Story = {};

/** Received is the history. */
export const DoneTab: Story = { args: { start: "done" } };

/** A line marked received leaves Open at once, the count moves, and Undo brings it back. */
export const ItemLeavesOpen: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: /Drip edge/ }));
    await waitFor(() => expect(c.queryByRole("button", { name: /Drip edge/ })).not.toBeInTheDocument());
    await expect(c.getByRole("radio", { name: "Open 2" })).toBeInTheDocument();
    await userEvent.click(await body.findByRole("button", { name: "Undo" }));
    await waitFor(() => expect(c.getByRole("button", { name: /Drip edge/ })).toBeInTheDocument());
  },
};

/** Nothing left: one line, no blank page. */
export const AllDone: Story = { args: { all: true } };
