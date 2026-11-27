import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import PhotoDrop, { type PhotoItem } from "./PhotoDrop";

const swatch = (c: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${c}"/></svg>`)}`;

const sent: PhotoItem[] = [
  { id: "1", name: "Box front IMG_0042.HEIC", url: swatch("#8a6d3b") },
  { id: "2", name: "Label close up IMG_0043.jpg", url: swatch("#3b5a8a") },
];

function Demo({ start }: { start: PhotoItem[] }) {
  const [photos, setPhotos] = useState(start);
  return (
    <div style={{ maxWidth: 560 }}>
      <PhotoDrop
        label="Photos"
        photos={photos}
        onAdd={(files) =>
          setPhotos((ps) => [...ps, ...files.map((f, i) => ({ id: `${f.name}-${i}`, name: f.name, url: swatch("#6b8a3b"), progress: 0.4 }))])
        }
        onRemove={(id) => setPhotos((ps) => ps.filter((p) => p.id !== id))}
      />
    </div>
  );
}

const meta = { title: "Fields/PhotoDrop", component: Demo, args: { start: [] } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing yet: the button opens the device's own picker, the box takes a drop. */
export const Empty: Story = {};

/** Two photos in: thumbnails, names, Remove on each; the count beside the label. */
export const WithPhotos: Story = { args: { start: sent } };

/** One sending, one that did not send. */
export const SendingAndFailed: Story = {
  args: {
    start: [
      { ...sent[0], progress: 0.6 },
      { ...sent[1], failed: "Not sent. Check the connection and add it again." },
    ],
  },
};

/** A photo added appends; a PDF is refused with its reason in one sentence. */
export const AddAndRefuse: Story = {
  args: { start: sent },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, [
      new File(["x"], "Pallet IMG_0050.jpg", { type: "image/jpeg" }),
      new File(["x"], "invoice.pdf", { type: "application/pdf" }),
    ], { applyAccept: false });
    await expect(await c.findByText("Pallet IMG_0050.jpg")).toBeInTheDocument();
    await expect(c.getByText(/invoice\.pdf is not a photo/)).toBeInTheDocument();
    await expect(c.getByText("Box front IMG_0042.HEIC")).toBeInTheDocument();
  },
};

/** Remove takes the one photo off. */
export const RemoveOne: Story = {
  args: { start: sent },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Remove Box front IMG_0042.HEIC" }));
    await expect(c.queryByText("Box front IMG_0042.HEIC")).not.toBeInTheDocument();
  },
};
