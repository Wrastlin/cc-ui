import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ListRow, RowList } from "./RowList";

const meta = { title: "Rows/RowList" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RowList label="Suppliers">
      <ListRow id="m" textValue="Manion's" onAction={fn()}>Manion's</ListRow>
      <ListRow id="a" textValue="ABC Supply" onAction={fn()}>ABC Supply</ListRow>
      <ListRow id="s" textValue="SRS" isDisabled>SRS</ListRow>
    </RowList>
  ),
};
