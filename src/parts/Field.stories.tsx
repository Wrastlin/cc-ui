import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextField } from "react-aria-components";
import { Description, FieldError, Input, Label } from "./Field";

const meta = { title: "Tailwind parts/Field" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TextField defaultValue="PO-00058" className="flex flex-col gap-1">
      <Label>PO number</Label><Input /><Description>As printed on the PO</Description>
    </TextField>
  ),
};
export const Invalid: Story = {
  render: () => (
    <TextField isInvalid defaultValue="58" className="flex flex-col gap-1">
      <Label>PO number</Label><Input /><FieldError>Write it as PO-00058</FieldError>
    </TextField>
  ),
};
