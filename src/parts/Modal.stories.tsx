import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "../Button";
import { Modal } from "./Modal";

const meta = { title: "Tailwind parts/Modal" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Open: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Modal title="Mark the job ready" isOpen onOpenChange={() => {}} actions={<><Button variant="secondary">Cancel</Button><Button>Mark ready</Button></>}>
      <p className="m-0">Test Developer Job moves to the Ready to start list.</p>
    </Modal>
  ),
};
export const Large: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Modal title="Every trade on the job" isOpen onOpenChange={() => {}} size="lg" actions={<Button>Done</Button>}>
      <p className="m-0">Roofing, Siding, Gutters.</p>
    </Modal>
  ),
};
