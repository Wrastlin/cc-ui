import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { MenuSheet, PhoneTabs } from "./PhoneMenu";

const apps = ["dashboard", "production", "checks", "estimating", "subcontracts"];

const meta = { title: "Shell/PhoneMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Tabs: Story = { render: () => <PhoneTabs apps={apps} path="/production" onMenu={fn()} /> };
export const Sheet: Story = { render: () => <MenuSheet apps={apps} path="/production" open onClose={fn()} /> };
