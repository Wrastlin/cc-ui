import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchField } from "./SearchField";

const meta = { title: "Tailwind parts/SearchField" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Empty: Story = { render: () => <SearchField label="Search jobs" placeholder="Name or job number" /> };
export const Filled: Story = { render: () => <SearchField label="Search jobs" defaultValue="22-1215" /> };
