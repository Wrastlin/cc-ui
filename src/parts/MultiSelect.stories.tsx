import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { MultiSelect } from "./MultiSelect";
const trades = [
  { id: "roof", label: "Roofing" },
  { id: "siding", label: "Siding" },
  { id: "gutters", label: "Gutters" },
  { id: "windows", label: "Windows" },
  { id: "soffit", label: "Soffit and fascia" },
  { id: "doors", label: "Doors" },
];

const meta = { title: "Tailwind parts/MultiSelect" } satisfies Meta;
export default meta;
type Story = StoryObj;

function Live(p: { label: string; start: Key[]; isDisabled?: boolean; errorMessage?: string }) {
  const [v, setV] = useState<Key[]>(p.start);
  return <MultiSelect label={p.label} options={trades} value={v} onChange={setV} isDisabled={p.isDisabled} errorMessage={p.errorMessage} />;
}
export const Picked: Story = { render: () => <Live label="Trades" start={["roof", "gutters"]} /> };
export const Many: Story = { render: () => <Live label="Trades" start={trades.map((t) => t.id)} /> };
export const None: Story = { render: () => <Live label="Trades" start={[]} /> };
export const Disabled: Story = { render: () => <Live label="Trades" start={["roof"]} isDisabled /> };
export const Error: Story = { render: () => <Live label="Trades" start={[]} errorMessage="Pick at least one trade" /> };
