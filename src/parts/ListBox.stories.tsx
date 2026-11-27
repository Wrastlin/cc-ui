import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListBox, ListItem, ListSection } from "./ListBox";

const meta = { title: "Tailwind parts/ListBox" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <ListBox aria-label="Color" selectionMode="single" defaultSelectedKeys={["clay"]}>
      <ListItem id="white">White</ListItem><ListItem id="clay">Clay</ListItem><ListItem id="black">Black</ListItem>
    </ListBox>
  ),
};
export const Sections: Story = {
  render: () => (
    <ListBox aria-label="Color" selectionMode="multiple">
      <ListSection title="Light"><ListItem id="white">White</ListItem></ListSection>
      <ListSection title="Dark"><ListItem id="black">Black</ListItem></ListSection>
    </ListBox>
  ),
};
