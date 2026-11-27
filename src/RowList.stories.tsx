import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Button from "./Button";
import { ListRow, RowList, usePaging } from "./RowList";

const meta = { title: "Rows/RowList" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Short: Story = {
  render: () => (
    <RowList label="Suppliers" paging="short">
      <ListRow id="m" textValue="Manion's" onAction={fn()}>Manion's</ListRow>
      <ListRow id="a" textValue="ABC Supply" onAction={fn()}>ABC Supply</ListRow>
      <ListRow id="s" textValue="SRS" isDisabled>SRS</ListRow>
    </RowList>
  ),
};

const pos = Array.from({ length: 46 }, (_, i) => `PO-${String(i + 1).padStart(5, "0")}`);
export const Paged: Story = {
  render: () => {
    const { page, paging } = usePaging(pos, 10);
    return (
      <RowList label="Open POs" paging={paging}>
        {page.map((p) => <ListRow key={p} id={p} textValue={p} onAction={fn()}>{p}</ListRow>)}
      </RowList>
    );
  },
};

/** Loading: three rows the shape of real rows, after 300 ms. */
export const Loading: Story = { render: () => <RowList label="Open POs" paging="short" state="loading" /> };

/** Ready with nothing in it: one line, one action. */
export const Empty: Story = {
  render: () => (
    <RowList label="Open POs" paging="short" empty={{ text: "No open POs.", action: <Button>New PO</Button> }} />
  ),
};

/** Failed: said in place, with Retry. */
export const Failed: Story = { render: () => <RowList label="Open POs" paging="short" state="failed" onRetry={fn()} /> };
