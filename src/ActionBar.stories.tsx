import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import ActionBar from "./ActionBar";
import DialogHost from "./DialogHost";

const remove = fn();
const names = ["22-1215 Test Developer Job", "22-1008 Bruce Czech", "22-1072 Ray Lamovec"];

function Demo({ count }: { count: number }) {
  return (
    <div style={{ minHeight: 320 }}>
      <ActionBar
        count={count}
        noun={{ one: "job", other: "jobs" }}
        names={names.slice(0, count)}
        actions={[
          { id: "crew", label: "Set crew", onAction: fn() },
          { id: "day", label: "Move day", onAction: fn() },
          { id: "print", label: "Print", onAction: fn() },
          { id: "delete", label: "Delete", onAction: remove, danger: true },
        ]}
        onClear={fn()}
      />
      <DialogHost />
    </div>
  );
}

const meta = { title: "Rows/ActionBar", component: Demo, args: { count: 3 } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Three ticked: the count, two actions (one on a phone), the rest in More, Clear. */
export const ThreeSelected: Story = {};

/** One ticked: the noun in the singular. */
export const OneSelected: Story = { args: { count: 1 } };

/** Nothing ticked: the bar is gone and the list header is back. */
export const NoneSelected: Story = { args: { count: 0 } };

/** Delete asks once for the whole set, naming the count and the jobs. */
export const DeleteAsksOnce: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    remove.mockClear();
    await userEvent.click(body.getByRole("button", { name: "More for the selected jobs" }));
    await userEvent.click(await body.findByRole("menuitem", { name: "Delete" }));
    await expect(await body.findByText("Delete 3 jobs?")).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Delete 3 jobs" }));
    await expect(remove).toHaveBeenCalledTimes(1);
  },
};
