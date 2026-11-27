import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, DialogTrigger, Dialog } from "react-aria-components";
import { Popover } from "./Popover";

const meta = { title: "Tailwind parts/Popover" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button className="ui-btn ui-btn-secondary">Filters</Button>
      <Popover>
        <Dialog aria-label="Filters" className="p-3">Late, Today, This week</Dialog>
      </Popover>
    </DialogTrigger>
  ),
};
