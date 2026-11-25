import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TagGroup, TagItem } from "./TagGroup";

const meta = { title: "Tailwind parts/TagGroup" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState(["Roofing", "Gutters", "Siding"]);
    return (
      <TagGroup label="Trades on the job" onRemove={(keys) => setTags(tags.filter((t) => !keys.has(t)))} emptyText="No trades">
        {tags.map((t) => <TagItem key={t} id={t}>{t}</TagItem>)}
      </TagGroup>
    );
  },
};
export const Selectable: Story = {
  render: () => (
    <TagGroup label="Pick a filter" selectionMode="single" defaultSelectedKeys={["late"]}>
      <TagItem id="late">Late</TagItem><TagItem id="today">Today</TagItem><TagItem id="week">This week</TagItem>
    </TagGroup>
  ),
};
