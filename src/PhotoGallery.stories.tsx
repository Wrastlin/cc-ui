import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, screen } from "storybook/test";
import PhotoGallery, { type GalleryPhoto, type GalleryValue } from "./PhotoGallery";
import { withCover } from "./gallery-order";
import { ToastHost } from "./Toast";

const swatch = (c: string, w = 400, h = 300) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${c}"/></svg>`)}`;

const box: GalleryPhoto[] = [
  { id: "1", name: "Box front IMG_0042.HEIC", url: swatch("#8a6d3b") },
  { id: "2", name: "Label close up IMG_0043.jpg", url: swatch("#3b5a8a") },
  { id: "3", name: "Pallet IMG_0050.jpg", url: swatch("#6b8a3b") },
  { id: "4", name: "Color chip IMG_0051.jpg", url: swatch("#8a3b5a") },
];

function Demo({ start }: { start: GalleryValue }) {
  const [v, setV] = useState<GalleryValue>(start);
  return (
    <div style={{ maxWidth: 560 }}>
      <ToastHost />
      <PhotoGallery
        label="Photos"
        value={v}
        onChange={setV}
        onAdd={(files) =>
          setV((cur) => withCover({ ...cur, photos: [...cur.photos, ...files.map((f, i) => ({ id: `${f.name}-${i}`, name: f.name, url: swatch("#3b8a7d") }))] }))
        }
      />
    </div>
  );
}

const meta = { title: "Fields/PhotoGallery", component: Demo, args: { start: { photos: [] } } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** No photos yet: only Add photos and the drop box. */
export const Empty: Story = {};

/** One photo is the cover; no strip under it. */
export const OnePhoto: Story = { args: { start: { photos: box.slice(0, 1), cover: "1" } } };

/** The cover across the field, then the strip of 60 px thumbnails with the cover marked. */
export const FourPhotos: Story = { args: { start: { photos: box, cover: "1" } } };

/** Adding appends and keeps the cover. */
export const AddKeepsCover: Story = {
  args: { start: { photos: box.slice(0, 2), cover: "1" } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, [new File(["x"], "Side IMG_0060.jpg", { type: "image/jpeg" })], { applyAccept: false });
    await expect(await c.findByRole("row", { name: "Side IMG_0060.jpg" })).toBeInTheDocument();
    await expect(c.getByRole("button", { name: "Open Box front IMG_0042.HEIC, the cover" })).toBeInTheDocument();
  },
};

/** Tap a thumbnail, Make cover: the cover changes. */
export const MakeCover: Story = {
  args: { start: { photos: box, cover: "1" } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("row", { name: "Pallet IMG_0050.jpg" }));
    await userEvent.click(await screen.findByRole("button", { name: "Make cover" }));
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await expect(c.getByRole("button", { name: "Open Pallet IMG_0050.jpg, the cover" })).toBeInTheDocument();
    await expect(c.getByRole("row", { name: "Pallet IMG_0050.jpg, cover" })).toBeInTheDocument();
    await expect(c.getByRole("row", { name: "Box front IMG_0042.HEIC" })).toBeInTheDocument();
  },
};

/** Remove from the photo's More, then Undo puts it back. */
export const RemoveAndUndo: Story = {
  args: { start: { photos: box, cover: "1" } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("row", { name: "Label close up IMG_0043.jpg" }));
    await userEvent.click(await screen.findByRole("button", { name: "More" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Remove" }));
    await expect(c.queryByRole("row", { name: "Label close up IMG_0043.jpg" })).not.toBeInTheDocument();
    await userEvent.click(await screen.findByRole("button", { name: "Undo" }));
    await expect(await c.findByRole("row", { name: "Label close up IMG_0043.jpg" })).toBeInTheDocument();
  },
};
