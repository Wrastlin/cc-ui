import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./Switch";

const meta = { title: "Tailwind parts/Switch" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const States: Story = {
  render: () => (
    <div className="flex flex-col"><Switch defaultSelected>Notifications</Switch><Switch>Text me too</Switch><Switch isDisabled>Email the crew</Switch></div>
  ),
};
