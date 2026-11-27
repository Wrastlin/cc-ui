import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "../Button";
import { Section, SectionRow } from "./Section";

const meta = { title: "Tailwind parts/Section" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const WithRows: Story = {
  render: () => (
    <Section title="Downspouts" count={3} action={<Button variant="text">Add downspout</Button>}>
      <SectionRow label="Front left" detail="3 by 4, White" end="18 ft" />
      <SectionRow label="Front right" detail="3 by 4, White" end="18 ft" />
      <SectionRow label="Back corner by the garage, a long place name that wraps" detail="2 by 3, White" end="11 ft" />
    </Section>
  ),
};
export const Empty: Story = { render: () => <Section title="Open questions" count={0}><SectionRow label="None" /></Section> };
