import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import TextArea from "./TextArea";

type P = Parameters<typeof TextArea>[0];
function Live(p: Omit<P, "onChange">) {
  const [v, setV] = useState(p.value);
  return <TextArea {...p} value={v} onChange={setV} />;
}

const meta = { title: "Fields/TextArea", component: Live } satisfies Meta<typeof Live>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "PO note", value: "Driver left 2 bundles at the gate." } };
export const Empty: Story = { args: { label: "PO note", value: "", rows: 4 } };
export const Error: Story = { args: { label: "PO note", value: "", error: "Write what was short" } };
export const Disabled: Story = { args: { label: "PO note", value: "Closed", isDisabled: true } };
export const HiddenLabel: Story = { args: { label: "PO note", value: "", hideLabel: true } };
