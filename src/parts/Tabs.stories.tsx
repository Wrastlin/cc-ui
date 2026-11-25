import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Segmented, TabItem, TabList, TabPanel, Tabs } from "./Tabs";

const meta = { title: "Tailwind parts/Tabs" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultSelectedKey="open">
      <TabList aria-label="Lines"><TabItem id="open">Open 7</TabItem><TabItem id="received">Received 2</TabItem><TabItem id="files" isDisabled>Files</TabItem></TabList>
      <TabPanel id="open">Lines still to come.</TabPanel>
      <TabPanel id="received">What came, newest first.</TabPanel>
      <TabPanel id="files">Files</TabPanel>
    </Tabs>
  ),
};
export const SegmentedControl: Story = {
  render: () => {
    const [v, setV] = useState<Key>("open");
    return <Segmented label="Show" value={v} onChange={setV} options={[{ id: "open", label: "Open" }, { id: "done", label: "Received" }]} />;
  },
};
