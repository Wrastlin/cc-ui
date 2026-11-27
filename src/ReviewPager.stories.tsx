import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import ReviewPager from "./ReviewPager";
import { nextOpen } from "./review";

const invoices = [
  { name: "Manion's 4471", done: false },
  { name: "ABC Supply 9902", done: true },
  { name: "Manion's 4480", done: false },
  { name: "Beacon 120-55", done: false },
];

function Demo({ start }: { start: number }) {
  const [items, setItems] = useState(invoices);
  const [i, setI] = useState(start);
  const left = items.filter((x) => !x.done).length;
  return (
    <div>
      <ReviewPager
        back={{ label: "Invoices", onBack: () => {} }}
        at={i + 1}
        total={items.length}
        noun="invoice"
        onPrev={i > 0 ? () => setI(i - 1) : null}
        onNext={i < items.length - 1 ? () => setI(i + 1) : null}
        decision={
          items[i].done
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
              }
        }
        more={[
          { id: "hold", label: "Put on hold" },
          { id: "pdf", label: "Open the original PDF" },
        ]}
        docTitle={items[i].name}
      />
      <h2 style={{ font: "inherit", fontWeight: 600, marginTop: 16 }}>{items[i].name}</h2>
    </div>
  );
}

const meta = { title: "Pages/ReviewPager", component: Demo, args: { start: 0 } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The first of a pile: Previous is off, the count left rides on Approve. */
export const FirstOfMany: Story = {};

/** In the middle: both arrows, named by noun. */
export const MiddleItem: Story = { args: { start: 2 } };

/** The last one: Next is off. */
export const LastItem: Story = { args: { start: 3 } };

/** Approve moves to the next open invoice, skipping the one already done, and the count drops. */
export const AfterDecisionNextOpen: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Approve, 3 left" }));
    await expect(c.getByRole("heading", { name: "Manion's 4480" })).toBeInTheDocument();
    await expect(c.getByText("3 of 4")).toBeInTheDocument();
    await expect(c.getByRole("button", { name: "Approve, 2 left" })).toBeInTheDocument();
  },
};

/** J and K step through on a keyboard; the page title carries the position. */
export const KeysJK: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.keyboard("j");
    await expect(c.getByText("2 of 4")).toBeInTheDocument();
    await expect(canvasElement.ownerDocument.title).toBe("ABC Supply 9902, 2 of 4");
    await userEvent.keyboard("k");
    await expect(c.getByText("1 of 4")).toBeInTheDocument();
  },
};
