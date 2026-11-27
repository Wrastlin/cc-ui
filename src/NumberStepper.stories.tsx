import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import NumberStepper from "./NumberStepper";

type P = Parameters<typeof NumberStepper>[0];
function Live(p: Omit<P, "onChange">) {
  const [v, setV] = useState(p.value);
  return <NumberStepper {...p} value={v} onChange={setV} />;
}

const meta = { title: "Fields/NumberStepper", component: Live } satisfies Meta<typeof Live>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Count", value: "12", min: 0 } };
export const WithUnit: Story = { args: { label: "Waste", value: "10", unit: "%", min: 0, max: 40 } };
export const Error: Story = { args: { label: "Count", value: "-1", error: "Count cannot be below 0" } };
export const Disabled: Story = { args: { label: "Count", value: "12", isDisabled: true } };
export const NoLabel: Story = { args: { label: "Count", value: "3", showLabel: false } };
