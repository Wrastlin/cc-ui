import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import Field, { TextInput } from "./Field";
import Form, { type FormErrors } from "./Form";

const save = fn();

function check(d: FormData): FormErrors {
  const e: FormErrors = {};
  if (!String(d.get("po") ?? "").trim()) e.po = "Enter the PO number";
  if (!/^\d+$/.test(String(d.get("count") ?? ""))) e.count = "Enter the count as a number";
  return e;
}

function Demo({ po, count }: { po: string; count: string }) {
  return (
    <Form onSave={save} validate={check}>
      <Field label="PO number" name="po">
        <TextInput name="po" defaultValue={po} />
      </Field>
      <Field label="Count received" name="count">
        <TextInput name="count" inputMode="numeric" defaultValue={count} />
      </Field>
    </Form>
  );
}

const meta = { title: "Fields/Form", component: Demo, args: { po: "PO-00058", count: "12" } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** One Save, at the end, in the flow. */
export const ExplicitSave: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    save.mockClear();
    await userEvent.click(c.getByRole("button", { name: "Save" }));
    await expect(save).toHaveBeenCalledTimes(1);
    (document.activeElement as HTMLElement | null)?.blur();
  },
};

/** Save with errors: the summary takes focus, each line links to its field, each field says it too. */
export const SaveWithErrors: Story = {
  args: { po: "", count: "twelve" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    save.mockClear();
    await userEvent.click(c.getByRole("button", { name: "Save" }));
    const summary = await c.findByRole("alert");
    await expect(summary).toHaveFocus();
    await expect(save).not.toHaveBeenCalled();
    await userEvent.click(c.getByRole("link", { name: "Enter the count as a number" }));
    await expect(c.getByRole("textbox", { name: /Count received/ })).toHaveFocus();
  },
};

/** Save is never disabled, even with nothing filled in. */
export const NeverDisabled: Story = {
  args: { po: "", count: "" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Save" })).toBeEnabled();
  },
};
