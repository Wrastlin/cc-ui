import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Menu from "./ActionMenu";

const items = [
  { id: "edit", label: "Edit", onAction: fn() },
  { id: "copy", label: "Copy link", onAction: fn() },
  { id: "sep", separator: true as const },
  { id: "del", label: "Remove", danger: true, onAction: fn() },
];

const meta = {
  title: "Parts/Menu",
  component: Menu,
  args: { label: "More", items },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Sections: Story = {
  args: {
    items: [
      { id: "views", section: "Views", items: [{ id: "w", label: "Work", current: true }, { id: "s", label: "Schedule" }] },
      { id: "ops", section: "Operations", items: [{ id: "p", label: "Print" }] },
    ],
  },
};
export const Checks: Story = {
  render: (args) => {
    const [sel, setSel] = useState<Set<string>>(new Set(["a"]));
    return (
      <Menu
        {...args}
        label="Crews"
        items={[{ id: "a", label: "Roofing" }, { id: "b", label: "Siding" }, { id: "c", label: "Gutters" }]}
        checks={{ selected: sel, onChange: setSel }}
      />
    );
  },
};
