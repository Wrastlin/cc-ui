import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox, CheckboxGroup } from "./Checkbox";

const meta = { title: "Tailwind parts/Checkbox" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Group: Story = {
  render: () => (
    <CheckboxGroup label="Before covering" defaultValue={["deck"]}>
      <Checkbox value="deck">Deck photographed</Checkbox><Checkbox value="flash">Flashing photographed</Checkbox><Checkbox value="vent" isDisabled>Vents photographed</Checkbox>
    </CheckboxGroup>
  ),
};
export const States: Story = {
  render: () => (
    <div className="flex flex-col">
      <Checkbox>Unchecked</Checkbox><Checkbox defaultSelected>Checked</Checkbox><Checkbox isIndeterminate>Some trades done</Checkbox><Checkbox isInvalid>Signed contract on file</Checkbox>
    </div>
  ),
};
