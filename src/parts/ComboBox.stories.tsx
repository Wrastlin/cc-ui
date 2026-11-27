import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, screen } from "storybook/test";
import { ComboBox } from "./ComboBox";
import { ListItem, ListSection } from "./ListBox";
const colors = [
  { id: "white", name: "White" },
  { id: "almond", name: "Almond" },
  { id: "clay", name: "Clay" },
  { id: "musket", name: "Musket Brown" },
];

const meta = { title: "Tailwind parts/ComboBox" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Empty: Story = { render: () => <ComboBox label="Gutter color" items={colors} placeholder="Type a color">{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox> };
export const Picked: Story = { render: () => <ComboBox label="Gutter color" items={colors} defaultSelectedKey="musket">{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox> };
export const Disabled: Story = { render: () => <ComboBox label="Gutter color" items={colors} defaultSelectedKey="white" isDisabled>{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox> };
export const Error: Story = { render: () => <ComboBox label="Gutter color" items={colors} isInvalid errorMessage="Pick a color from the list">{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox> };
export const Grouped: Story = {
  render: () => (
    <ComboBox label="Color">
      <ListSection title="Light"><ListItem id="white">White</ListItem><ListItem id="almond">Almond</ListItem></ListSection>
      <ListSection title="Dark"><ListItem id="musket">Musket Brown</ListItem><ListItem id="black">Black</ListItem></ListSection>
    </ComboBox>
  ),
};

function OpenSet() {
  const [list, setList] = useState(colors);
  return (
    <div className="flex max-w-sm flex-col gap-2">
      <ComboBox
        label="Gutter color"
        items={list}
        onCreate={(text) => {
          const id = text.toLowerCase();
          setList((l) => [...l, { id, name: text }]);
        }}
      >
        {(c) => <ListItem id={c.id}>{c.name}</ListItem>}
      </ComboBox>
    </div>
  );
}

/** An open set: type a color that is not listed, then Add it with one tap. No "Something else" button. */
export const AddWhatWasTyped: Story = {
  render: () => <OpenSet />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByRole("combobox", { name: "Gutter color" }), "Copper Penny");
    await userEvent.click(await screen.findByRole("button", { name: "Add “Copper Penny”" }));
    await expect(c.getByRole("combobox", { name: "Gutter color" })).toHaveValue("Copper Penny");
  },
};

/** Typing narrows the list. */
export const TypingFilters: Story = {
  render: () => <ComboBox label="Gutter color" items={colors}>{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox>,
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox", { name: "Gutter color" }), "cl");
    await expect(await screen.findByRole("option", { name: "Clay" })).toBeInTheDocument();
    await expect(screen.queryByRole("option", { name: "White" })).not.toBeInTheDocument();
  },
};

/** Tapping the field opens the list, so a phone user sees the choices before typing. */
export const OpensOnTap: Story = {
  render: () => <ComboBox label="Gutter color" items={colors}>{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox>,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox", { name: "Gutter color" }));
    await expect(await screen.findByRole("option", { name: "Musket Brown" })).toBeInTheDocument();
  },
};

/** Options still coming: a loading row, not "No match". */
export const Loading: Story = {
  render: () => <ComboBox label="Supplier" items={[] as { id: string; name: string }[]} loading>{(c) => <ListItem id={c.id}>{c.name}</ListItem>}</ComboBox>,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox", { name: "Supplier" }));
    await expect(await screen.findByRole("status")).toHaveTextContent("Loading");
  },
};
