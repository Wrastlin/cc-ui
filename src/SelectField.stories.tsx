import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import SelectField from "./SelectField";

type P = Parameters<typeof SelectField>[0];
function Live(p: Omit<P, "onChange">) {
  const [v, setV] = useState(p.value);
  return <SelectField {...p} value={v} onChange={setV} />;
}

const colors = [
  { value: "white", label: "White", swatch: "#ffffff" },
  { value: "clay", label: "Clay", swatch: "#b9a98c" },
  { value: "black", label: "Black", swatch: "#1d1d1d" },
];
const suppliers = [
  { value: "m", label: "Manion's" },
  { value: "a", label: "ABC Supply" },
  { value: "s", label: "SRS" },
];

const meta = { title: "Fields/SelectField", component: Live } satisfies Meta<typeof Live>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Supplier", value: "m", options: suppliers } };
export const Swatches: Story = { args: { label: "Color", value: "clay", options: colors, swatches: true } };
export const Error: Story = { args: { label: "Supplier", value: "", options: suppliers, error: "Pick a supplier" } };
export const Disabled: Story = { args: { label: "Supplier", value: "m", options: suppliers, isDisabled: true } };
export const Inline: Story = { args: { label: "Supplier", value: "m", options: suppliers, size: "inline", hideLabel: true } };
