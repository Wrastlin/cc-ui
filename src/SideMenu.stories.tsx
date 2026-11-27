import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SideMenu } from "./SideMenu";

const apps = ["dashboard", "production", "checks", "estimating", "subcontracts", "crmp"];

const meta = { title: "Shell/SideMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

function Live({ start }: { start: boolean }) {
  const [folded, setFolded] = useState(start);
  return (
    <div style={{ height: 640, display: "flex" }}>
      <SideMenu apps={apps} path="/production" folded={folded} onFold={setFolded} logoHref="/" />
    </div>
  );
}
export const Open: Story = { render: () => <Live start={false} /> };
export const Folded: Story = { render: () => <Live start={true} /> };
