import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import YesNo, { ChoiceGroup, RadioChoice } from "./YesNo";

const meta = { title: "Fields/YesNo" } satisfies Meta;
export default meta;
type Story = StoryObj;

function LiveYesNo({ start, disabled }: { start?: string; disabled?: boolean }) {
  const [v, setV] = useState<string | undefined>(start);
  return <YesNo label="Color matches the contract?" value={v} onPick={setV} isDisabled={disabled} />;
}
export const Unanswered: Story = { render: () => <LiveYesNo /> };
export const Yes: Story = { render: () => <LiveYesNo start="yes" /> };
export const No: Story = { render: () => <LiveYesNo start="no" /> };
export const Disabled: Story = { render: () => <LiveYesNo start="yes" disabled /> };

export const Choices: Story = {
  render: () => {
    const [v, setV] = useState<"r" | "s" | "g" | "">("s");
    return (
      <ChoiceGroup
        label="Trade"
        value={v}
        options={[["r", "Roofing"], ["s", "Siding"], ["g", "Gutters"]]}
        onPick={setV}
        onClear={() => setV("")}
      />
    );
  },
};
export const Suggested: Story = {
  render: () => {
    const [v, setV] = useState<"a" | "b" | "">("");
    return <ChoiceGroup label="Waste" value={v} options={[["a", "10%"], ["b", "15%"]]} onPick={setV} suggested="a" />;
  },
};
export const Radio: Story = {
  render: () => {
    const [v, setV] = useState<"o" | "r">("o");
    return <RadioChoice label="Show" value={v} options={[["o", "Open"], ["r", "Received"]]} onPick={setV} />;
  },
};
export const RadioInline: Story = {
  render: () => {
    const [v, setV] = useState<"o" | "r">("r");
    return <RadioChoice label="Show" value={v} options={[["o", "Open"], ["r", "Received"]]} onPick={setV} inline />;
  },
};
