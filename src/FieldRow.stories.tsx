import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";
import Field, { TextInput } from "./Field";
import FieldRow from "./FieldRow";

const meta = { title: "Fields/FieldRow", component: FieldRow } satisfies Meta<typeof FieldRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const fields = (
  <>
    <Field label="Supplier"><TextInput defaultValue="Manion's" /></Field>
    <Field label="PO number"><TextInput defaultValue="PO-00058" /></Field>
  </>
);
export const Default: Story = { args: { children: fields } };
export const WithAction: Story = { args: { children: fields, action: <Button variant="primary">Find</Button> } };
