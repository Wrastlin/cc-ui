import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Swatch from "./ColorSwatch";

const meta = { title: "Parts/ColorSwatch", component: Swatch } satisfies Meta<typeof Swatch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Clay: Story = { args: { hex: "#b9a98c", size: 24, label: "Clay" } };
export const WhiteWithEdge: Story = { args: { hex: "#ffffff", size: 24, edge: true, label: "White" } };
export const Hollow: Story = { args: { hex: "#1d1d1d", size: 24, hollow: true, label: "Black" } };
export const Unknown: Story = { args: { hex: null, size: 24, label: "No color" } };
