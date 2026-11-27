import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import TextField from "./TextField";

type P = Parameters<typeof TextField>[0];
function Live(p: Omit<P, "onChange">) {
  const [v, setV] = useState(p.value);
  return <TextField {...p} value={v} onChange={setV} />;
}

const meta = { title: "Fields/TextField", component: Live } satisfies Meta<typeof Live>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Job name", value: "Jordan Smith" } };
export const Empty: Story = { args: { label: "Job name", value: "" } };
export const Required: Story = { args: { label: "Job name", value: "", isRequired: true } };
export const Error: Story = { args: { label: "Email", value: "pat@", type: "email", error: "Enter a full email address" } };
export const Disabled: Story = { args: { label: "PO number", value: "PO-00052", isDisabled: true } };
export const Multiline: Story = { args: { label: "Note", value: "Two boxes short", multiline: true, rows: 3 } };
export const Date: Story = { args: { label: "Received", value: "2026-11-25", type: "date" } };
