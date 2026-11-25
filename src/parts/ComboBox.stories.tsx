import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
