import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CCLogo } from "./CCLogo";

const meta = { title: "Parts/CCLogo", component: CCLogo } satisfies Meta<typeof CCLogo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = { args: { variant: "mark", height: 28 } };
export const Lockup: Story = { args: { variant: "lockup", height: 48 } };
export const Mono: Story = {
  args: { variant: "mono", height: 48 },
  decorators: [(S) => <div style={{ background: "#111", color: "#fff", padding: 16 }}><S /></div>],
};
