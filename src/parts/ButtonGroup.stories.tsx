import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonGroup, ButtonGroupItem } from "./ButtonGroup";

const meta = { title: "Tailwind parts/ButtonGroup" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <ButtonGroup aria-label="Zoom" selectionMode="single" defaultSelectedKeys={["week"]}>
      <ButtonGroupItem id="day">Day</ButtonGroupItem><ButtonGroupItem id="week">Week</ButtonGroupItem><ButtonGroupItem id="month">Month</ButtonGroupItem>
    </ButtonGroup>
  ),
};
export const Multiple: Story = {
  render: () => (
    <ButtonGroup aria-label="Filters" selectionMode="multiple" defaultSelectedKeys={["roof"]}>
      <ButtonGroupItem id="roof">Roofing</ButtonGroupItem><ButtonGroupItem id="gutters">Gutters</ButtonGroupItem><ButtonGroupItem id="siding" isDisabled>Siding</ButtonGroupItem>
    </ButtonGroup>
  ),
};
