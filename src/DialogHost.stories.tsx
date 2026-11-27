import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import DialogHost from "./DialogHost";
import { alertDialog, confirmDialog, promptDialog, resolveDialog } from "./dialogs";

function Opened({ open }: { open: () => unknown }) {
  useEffect(() => {
    void open();
    return () => resolveDialog(null);
  }, [open]);
  return <DialogHost />;
}

const meta = { title: "Overlays/Dialog", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Alert: Story = { render: () => <Opened open={() => alertDialog({ title: "Photo saved" })} /> };
export const Confirm: Story = {
  render: () => (
    <Opened open={() => confirmDialog({ title: "Mark PO-00052 received?", body: "All 14 lines move to Received.", confirmLabel: "Mark received" })} />
  ),
};
export const Danger: Story = {
  render: () => <Opened open={() => confirmDialog({ title: "Remove this photo?", confirmLabel: "Remove", danger: true })} />,
};
export const Prompt: Story = {
  render: () => <Opened open={() => promptDialog({ title: "Count received", defaultValue: "12", confirmLabel: "Save" })} />,
};
