import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { CheckAnswers, Confirmation } from "./CheckAnswers";
import Button from "./Button";

const meta = { title: "Templates/Steps end" } satisfies Meta;
export default meta;
type Story = StoryObj;

/** Every answer with a Change link back to its step; a missing answer is a word. */
export const Check: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <CheckAnswers
        sections={[
          {
            title: "Truck",
            answers: [
              { label: "Supplier", value: "Manion's Wholesale", change: "#supplier" },
              { label: "Received", value: "Tue, Nov 25", change: "#date" },
            ],
          },
          {
            title: "Lines",
            answers: [
              { label: "Received in full", value: "14", numeric: true, change: "#lines" },
              { label: "Short", value: "2", numeric: true, change: "#lines" },
              { label: "Note", value: "", change: "#note" },
            ],
          },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("link", { name: "Change supplier" })).toHaveAttribute("href", "#supplier");
    await expect(c.getByText("Not answered")).toBeInTheDocument();
  },
};

/** What was done, then what happens next. */
export const Done: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Confirmation
        title="Truck received"
        next={["The two short lines stay open on the PO.", "The invoice audit reads today's counts."]}
        action={<Button variant="secondary" href="#receiving">Back to Receiving</Button>}
      />
    </div>
  ),
};
