import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";
import DescriptionList from "./DescriptionList";

const meta = { title: "Layout/DescriptionList", component: DescriptionList } satisfies Meta<typeof DescriptionList>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Short values: label left, value right, at every width. */
export const ShortValues: Story = {
  args: {
    facts: [
      { label: "Job", value: "22-1215 Test Developer Job" },
      { label: "Status", value: "Ready to start" },
      { label: "Start", value: "Dec 2, 2026", numeric: true },
      { label: "Crew", value: "Mario Gonzalez", action: <Button variant="text" size="sm">Change</Button> },
      { label: "Permit", value: "" },
    ],
  },
};

/** A long value goes under its label, never cut. */
export const LongValueStacks: Story = {
  args: {
    facts: [
      { label: "Address", value: "4120 North Old Highway 41, Building C behind the gravel lot, Suite 200", long: true },
      { label: "Note", value: "Driver left 2 bundles at the gate; the rest comes Tuesday with the second truck.", long: true },
    ],
  },
};

/** Money lines up by the decimal. */
export const MoneyColumnAligned: Story = {
  args: {
    facts: [
      { label: "Contract", value: "$18,420.00", numeric: true },
      { label: "Paid", value: "$9,210.00", numeric: true },
      { label: "Owed", value: "$9,210.00", numeric: true },
    ],
  },
};
