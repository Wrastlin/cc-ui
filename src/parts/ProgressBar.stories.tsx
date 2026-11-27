import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

const meta = { title: "Tailwind parts/ProgressBar" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Value: Story = { render: () => <ProgressBar label="Steps done" value={5} maxValue={8} valueLabel="5 of 8" /> };
export const Indeterminate: Story = { render: () => <ProgressBar label="Loading the roof report" isIndeterminate /> };
