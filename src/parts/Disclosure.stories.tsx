import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Disclosure } from "./Disclosure";

const meta = { title: "Tailwind parts/Disclosure" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Expanded: Story = { render: () => <Disclosure title="Job history" defaultExpanded>Sold, then measured, then scheduled.</Disclosure> };
export const Collapsed: Story = { render: () => <Disclosure title="Rarely used fields">Permit number and lot.</Disclosure> };
