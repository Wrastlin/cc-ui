import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { DateField } from "./DateField";

function Demo({ start, min, max }: { start: string | null; min?: string; max?: string }) {
  const [v, setV] = useState<string | null>(start);
  return (
    <div style={{ minHeight: 420 }}>
      <DateField label="Received" value={v} onChange={setV} min={min} max={max} />
      <p data-testid="iso" style={{ marginTop: 12 }}>{v ?? "none"}</p>
    </div>
  );
}

const meta = { title: "Tailwind parts/DateField", component: Demo, args: { start: "2026-11-25" } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};
export const Empty: Story = { args: { start: null } };

/** A received date set back by typing, the way it is read off a marked PO. */
export const TypedBackDate: Story = {
  args: { start: null, max: "2026-11-27" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const month = c.getByRole("spinbutton", { name: /month/i });
    await userEvent.click(month);
    await userEvent.keyboard("11202026");
    await expect(c.getByTestId("iso")).toHaveTextContent("2026-11-20");
    (document.activeElement as HTMLElement | null)?.blur();
  },
};

/** After the last allowed day, it says which day is the limit. */
export const AfterMax: Story = {
  args: { start: "2026-12-05", max: "2026-11-27" },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText("Pick Nov 27, 2026 or earlier")).toBeInTheDocument();
  },
};
