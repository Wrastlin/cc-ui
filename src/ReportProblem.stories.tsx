import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HelperInBar, ReportButton } from "./ReportProblem";

const meta = { title: "Shell/Helper", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Floating: Story = { render: () => <div style={{ height: 300 }}><ReportButton app="Catalog" endpoint="/api/none" /></div> };
export const InBar: Story = { render: () => <div style={{ padding: 16 }}><HelperInBar /></div> };
