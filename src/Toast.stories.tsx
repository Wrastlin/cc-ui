import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import Button from "./Button";
import { toast, ToastHost } from "./Toast";

const undo = fn();

function Demo({ text, withUndo }: { text: string; withUndo: boolean }) {
  return (
    <div style={{ minHeight: 240 }}>
      <Button onClick={() => toast(text, withUndo ? { undo } : {})}>Delete line</Button>
      <ToastHost />
    </div>
  );
}

const meta = {
  title: "Feedback/Toast",
  component: Demo,
  parameters: { layout: "fullscreen" },
  args: { text: "Line deleted from PO-00058.", withUndo: true },
} satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Deleted, with Undo, under the top bar. */
export const UndoAfterDelete: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Delete line" }));
    await expect(await c.findByText("Line deleted from PO-00058.")).toBeInTheDocument();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};

/** Undo runs the callback and closes the toast. */
export const UndoUsed: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement.ownerDocument.body);
    undo.mockClear();
    await userEvent.click(c.getByRole("button", { name: "Delete line" }));
    await userEvent.click(await c.findByRole("button", { name: "Undo" }));
    await expect(undo).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(c.queryByText("Line deleted from PO-00058.")).toBeNull());
  },
};

/** A second toast replaces the first: one at a time. */
export const OneAtATime: Story = {
  args: { text: "Saved.", withUndo: false },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement.ownerDocument.body);
    toast("Line deleted from PO-00058.", { undo });
    await userEvent.click(c.getByRole("button", { name: "Delete line" }));
    await expect(await c.findByText("Saved.")).toBeInTheDocument();
    await expect(c.queryByText("Line deleted from PO-00058.")).toBeNull();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
