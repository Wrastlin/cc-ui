import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";
import InlineMessage from "./InlineMessage";

const meta = { title: "Feedback/InlineMessage", component: InlineMessage } satisfies Meta<typeof InlineMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { tone: "info", children: "Lines come from Zoho; a PO made now shows here within a minute." } };
export const Good: Story = { args: { tone: "good", children: "12 of 12 received on PO-00058." } };
export const Warn: Story = { args: { tone: "warn", title: "2 short", children: "Short lines stay open until the rest arrives." } };
export const DangerWithAction: Story = {
  args: { tone: "danger", title: "Not saved", children: "The connection dropped.", action: <Button>Retry</Button> },
};
export const NeverTruncates: Story = {
  args: {
    tone: "warn",
    title: "Back corner by the garage, a long place name that wraps",
    children: "3 by 4 downspout, White, 18 ft, ordered on PO-00058 from Manion's and still not on the truck after two deliveries.",
    action: <Button>Open the PO</Button>,
  },
};
export const StackedBySeverity: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      <InlineMessage tone="danger" title="Not saved" action={<Button>Retry</Button>}>The connection dropped.</InlineMessage>
      <InlineMessage tone="warn">2 lines short.</InlineMessage>
      <InlineMessage tone="info">Received dates can be set back.</InlineMessage>
    </div>
  ),
};
