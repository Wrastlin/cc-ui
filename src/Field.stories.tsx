import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Field, { Select, TextInput } from "./Field";

const meta = { title: "Fields/Field", component: Field } satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = { args: { label: "PO number", children: <TextInput defaultValue="PO-00052" /> } };
export const WithSelect: Story = {
  args: {
    label: "Supplier",
    children: (
      <Select defaultValue="m">
        <option value="m">Manion's</option>
        <option value="a">ABC Supply</option>
      </Select>
    ),
  },
};
export const WithHelp: Story = { args: { label: "Count", help: "As written on the ticket", children: <TextInput defaultValue="12" /> } };
export const Error: Story = { args: { label: "Count", error: true, help: "Enter a number", children: <TextInput defaultValue="twelve" /> } };
