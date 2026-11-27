"use client";

import { useId, useState } from "react";
import { Button as AriaButton, GridList, GridListItem, useDragAndDrop, type Key } from "react-aria-components";
import Button from "./Button";
import Menu from "./ActionMenu";
import Sheet from "./Sheet";
import { toast } from "./Toast";
import { PhotoAdd } from "./PhotoDrop";
import { move, withCover } from "./gallery-order";

// A record's photos as one field (gap 16; his 11/24 ask: the real box photo is the item's picture, cover plus
// thumbnails, adding never replaces). Polaris thumbnail sizes (60 in the strip, 40 in lists), Apple's image well (an
// editable picture takes add, drag and delete), Toast with Undo in place of a confirm (Apple, Fluent).
// Decided by Claude: a thumbnail's actions (Make cover, Move left, Move right, Remove) live in the photo's Sheet, not a
// menu button on the 60 px thumbnail, because a button pressed into a picture that small is the cramped target he
// refused on 11/18. Drag reorders on a desk; Move left and right do it on a phone, so nothing is drag only.

export type GalleryPhoto = { id: string; name: string; url: string };
export type GalleryValue = { photos: readonly GalleryPhoto[]; cover?: string };

export default function PhotoGallery({
  label,
  value,
  onChange,
  onAdd,
  maxBytes,
}: {
  label: string;
  value: GalleryValue;
  /** Every change in one call: order, cover, a removal and its Undo. */
  onChange: (next: GalleryValue) => void;
  /** Accepted files in the order picked. Append them; withCover() sets the cover only when there is none. */
  onAdd: (files: File[]) => void;
  maxBytes?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState<string | null>(null);
  const { photos } = value;
  const n = photos.length;
  const coverId = value.cover && photos.some((p) => p.id === value.cover) ? value.cover : photos[0]?.id;
  const cover = photos.find((p) => p.id === coverId);
  const shown = photos.find((p) => p.id === open);
  const at = shown ? photos.indexOf(shown) : -1;

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((k) => ({ "text/plain": photos.find((p) => p.id === k)?.name ?? String(k) })),
    onReorder(e) {
      const target = photos.findIndex((p) => p.id === e.target.key);
      const from = photos.findIndex((p) => e.keys.has(p.id));
      if (target < 0 || from < 0) return;
      const to = e.target.dropPosition === "after" ? target + (from > target ? 1 : 0) : target - (from < target ? 1 : 0);
      onChange({ ...value, photos: move(photos, from, to) });
    },
  });

  function remove(p: GalleryPhoto) {
    const before = value;
    setOpen(null);
    onChange(withCover({ photos: photos.filter((x) => x.id !== p.id), cover: coverId === p.id ? undefined : coverId }));
    toast("Photo removed", { undo: () => onChange(before) });
  }

  return (
    <div className="ui-gallery" role="group" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`} className="ui-photodrop-label">
        {label}
        {n ? <span className="ui-photodrop-count">{` ${n.toLocaleString("en-US")}`}</span> : null}
      </span>
      {cover ? (
        <button type="button" className="ui-gallery-cover" onClick={() => setOpen(cover.id)} aria-label={`Open ${cover.name}, the cover`}>
          <img src={cover.url} alt="" />
        </button>
      ) : null}
      {n > 1 ? (
        <GridList
          layout="grid"
          aria-label={`${label}, ${n} photos`}
          className="ui-gallery-strip"
          items={photos}
          dependencies={[coverId]}
          dragAndDropHooks={dragAndDropHooks}
          onAction={(k: Key) => setOpen(String(k))}
        >
          {(p) => (
            <GridListItem id={p.id} textValue={p.id === coverId ? `${p.name}, cover` : p.name} className="ui-gallery-thumb">
              <AriaButton slot="drag" className="ui-gallery-drag" aria-label={`Move ${p.name}`} />
              <img src={p.url} alt="" width={60} height={60} />
              {p.id === coverId ? <span className="ui-gallery-cover-mark">Cover</span> : null}
            </GridListItem>
          )}
        </GridList>
      ) : null}
      <PhotoAdd label={label} onAdd={onAdd} maxBytes={maxBytes} />
      <Sheet
        open={!!shown}
        onClose={() => setOpen(null)}
        title={shown ? `Photo ${at + 1} of ${n}` : undefined}
        placement="center"
        actions={{ cancel: <Button variant="text" onClick={() => setOpen(null)}>Close</Button> }}
      >
        {shown ? (
          <div className="ui-gallery-full">
            <img src={shown.url} alt={shown.name} />
            <div className="ui-gallery-full-bar">
              <span className="ui-gallery-full-name">{shown.name}</span>
              {shown.id === coverId ? (
                <span className="ui-gallery-cover-word">Cover</span>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => onChange({ ...value, cover: shown.id })}>
                  Make cover
                </Button>
              )}
              <Menu
                label="More"
                variant="secondary"
                items={[
                  { id: "left", label: "Move left", disabled: at <= 0, onAction: () => onChange({ ...value, photos: move(photos, at, at - 1) }) },
                  { id: "right", label: "Move right", disabled: at >= n - 1, onAction: () => onChange({ ...value, photos: move(photos, at, at + 1) }) },
                  { id: "sep", separator: true },
                  { id: "remove", label: "Remove", danger: true, onAction: () => remove(shown) },
                ]}
              />
            </div>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
