import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Button from "./Button";
import Sheet from "./Sheet";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  parameters: { layout: "fullscreen" },
  args: { open: true, onClose: fn(), title: "PO note", children: <p>Driver left 2 bundles at the gate.</p> },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = { args: { placement: "bottom" } };
export const Center: Story = { args: { placement: "center" } };
export const WithFooter: Story = { args: { footer: <Button variant="primary" block>Save</Button> } };

/** Phone: Cancel leading, the one primary trailing, at the top (Aaron 11/19, Apple sheets). */
export const PhoneTopActions: Story = {
  args: {
    title: "Receive line",
    actions: { cancel: <Button variant="text">Cancel</Button>, primary: <Button variant="text">Save</Button> },
    children: <p>3 by 4 downspout, White. 12 expected.</p>,
  },
};

/** A later step: Back replaces Cancel, Done stays trailing. */
export const PhoneStepsBackDone: Story = {
  args: {
    title: "Step 2 of 2",
    actions: { cancel: <Button variant="text">Back</Button>, primary: <Button variant="text">Done</Button> },
    children: <p>Check the count, then Done.</p>,
  },
};

/** A centered dialog: on a computer the same two buttons sit bottom right, primary last; a phone keeps the top bar. */
export const DeskFooterActions: Story = {
  args: {
    placement: "center",
    title: "Rename crew",
    actions: { cancel: <Button>Cancel</Button>, primary: <Button variant="primary">Save</Button> },
    children: <p>Crew name: Mario Gonzalez roofing.</p>,
  },
};

/** Nothing to decide: a Close only. */
export const CloseOnly: Story = {
  args: { title: "PO note", actions: { cancel: <Button variant="text">Close</Button> } },
};
