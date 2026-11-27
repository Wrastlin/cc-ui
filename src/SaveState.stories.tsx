import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Field, { TextInput } from "./Field";
import { OfflineLine, SaveState, type SaveStatus } from "./SaveState";

function Demo({ status }: { status: SaveStatus }) {
  return (
    <div style={{ maxWidth: 320 }}>
      <Field label="Count received">
        <TextInput defaultValue="12" inputMode="numeric" />
      </Field>
      <SaveState status={status} onRetry={fn()} />
    </div>
  );
}

const meta = { title: "Feedback/SaveState", component: Demo, args: { status: "idle" } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};
export const Saving: Story = { args: { status: "saving" } };
export const Saved: Story = { args: { status: "saved" } };
export const Failed: Story = { args: { status: "failed" } };
export const Waiting: Story = { args: { status: "waiting" } };

/** The page's line when the connection drops, with what is waiting. */
export const NotConnected: Story = {
  render: () => <OfflineLine online={false} waiting={3} noun={{ one: "count", other: "counts" }} delayMs={0} />,
};
