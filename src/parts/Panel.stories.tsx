import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "../Button";
import { Panel } from "./Panel";

const meta = { title: "Tailwind parts/Panel" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Panel title="Job" action={<Button variant="text">Edit</Button>}>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-cc-body">
        <dt className="text-cc-meta text-cc-muted">Job</dt><dd className="m-0">22-1215 Test Developer Job</dd>
        <dt className="text-cc-meta text-cc-muted">Status</dt><dd className="m-0">Ready to start</dd>
      </dl>
    </Panel>
  ),
};
