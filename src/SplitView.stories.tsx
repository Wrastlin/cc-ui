import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackButton } from "./BackButton";
import Row from "./Row";
import SplitView from "./SplitView";

const list = (
  <div className="ui-rows">
    <Row href="/r/52" title="PO-00052" sub="Manion's" trailing="14" />
    <Row href="/r/58" title="PO-00058" sub="Manion's" trailing="9" />
  </div>
);
const detail = <p style={{ padding: 16 }}>PO-00058, 9 lines open.</p>;

const meta = { title: "Layout/SplitView", component: SplitView, parameters: { layout: "fullscreen" } } satisfies Meta<typeof SplitView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ListShowing: Story = { args: { list, showing: "list" } };
export const DetailShowing: Story = {
  args: { list, detail, showing: "detail", back: <BackButton label="Open POs" href="/r" />, head: <h2 style={{ margin: 16 }}>PO-00058</h2> },
};
