import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Gallery from "./Gallery";

const meta = { title: "Tailwind parts/All parts", component: Gallery, parameters: { layout: "fullscreen" } } satisfies Meta<typeof Gallery>;
export default meta;
export const Everything: StoryObj<typeof meta> = {};
