import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio, RadioGroup } from "./Radio";

const meta = { title: "Tailwind parts/RadioGroup", component: RadioGroup } satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const kids = (
  <>
    <Radio value="full">All of it came</Radio>
    <Radio value="short">Some is short</Radio>
    <Radio value="none">None of it came</Radio>
  </>
);

export const LikelyFirst: Story = { args: { label: "This line", defaultValue: "full", children: kids } };
export const Unanswered: Story = { args: { label: "This line", children: kids } };
export const GroupError: Story = {
  args: { label: "This line", isInvalid: true, errorMessage: "Pick what came on the truck", children: kids },
};
