import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import CountRow, { CountHead } from "./CountRow";

const meta = {
  title: "Rows/CountRow",
  component: CountRow,
  parameters: { layout: "fullscreen" },
  args: { n: 4, title: "QE Solid Soffit 12' - 16\"", code: "QESST", count: "0 of 3 EA", onOpen: fn(), mark: { label: "Received", "aria-label": "Received, line 4", onPress: fn() } },
  decorators: [(S) => <div className="ui-rows"><S /></div>],
} satisfies Meta<typeof CountRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
export const Short: Story = { args: { note: "32 left", count: "12 of 44 EA" } };
export const Done: Story = { args: { done: true, count: "3 of 3 EA", mark: { label: "Received", "aria-label": "Received, line 4", done: true, disabled: true } } };
export const NoMark: Story = { args: { mark: undefined } };
export const Columns: StoryObj = {
  render: () => (
    <>
      <CountHead n="No." title="Item" cells={["Ordered", "Received", "Left"]} />
      <CountRow n={1} title="QE Frieze Channel" code="QEF38T" cells={[45, 0, 45]} onOpen={fn()} mark={{ label: "Received", "aria-label": "Received, line 1" }} />
      <CountRow n={2} title="QE Mitre Divider 10'" code="QEMT" cells={[4, 4, 0]} done onOpen={fn()} mark={{ label: "Received", "aria-label": "Received, line 2", done: true, disabled: true }} />
    </>
  ),
};
