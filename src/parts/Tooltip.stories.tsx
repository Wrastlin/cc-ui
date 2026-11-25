import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "../Button";
import { Tooltip, TooltipTrigger } from "./Tooltip";

const meta = { title: "Tailwind parts/Tooltip" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => (
    <div style={{ paddingTop: 48 }}>
      <TooltipTrigger defaultOpen>
        <Button variant="secondary">Print</Button>
        <Tooltip>Print the job packet</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};
