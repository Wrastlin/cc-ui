"use client";

import { useId, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { DropZone, FileTrigger, isFileDropItem, type DropZoneProps } from "react-aria-components";

type DropEvent = Parameters<NonNullable<DropZoneProps["onDrop"]>>[0];
import Button from "./Button";
import { PHOTO_ACCEPT, refusal, shrinkSize } from "./photo";

// Add photos to a record (gap 16; React Aria DropZone and FileTrigger, Polaris drop zone, Carbon file uploader).
// Aaron 11/25: "a visible Add photos button ... a drag and drop for any other device photos? In the formats you
// accept?" One button opens the device's own picker (the Photos library on an iPhone); the whole region takes a drop
// with a visible drop state; each photo is a row with a 40 px thumbnail, its progress and Remove; a refused file is
// listed with its reason in one sentence. Adding never replaces.

export type PhotoItem = {
  id: string;
  name: string;
  /** A preview address (an object URL or the stored photo's). */
  url: string;
  /** 0 to 1 while sending; absent when sent. */
  progress?: number;
  /** Why it did not send, with the caller's Retry in the row's place. */
  failed?: string;
};

export default function PhotoDrop({
  label,
  photos,
  onAdd,
  onRemove,
  maxBytes,
}: {
  label: string;
  photos: readonly PhotoItem[];
  /** The accepted files, in the order picked. Shrink each with shrinkPhoto before sending. */
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  maxBytes?: number;
}) {
  const id = useId();
  const [refused, setRefused] = useState<string[]>([]);

  function take(files: File[]) {
    const ok: File[] = [];
    const no: string[] = [];
    for (const f of files) {
      const why = refusal(f.name, f.type, f.size, maxBytes);
      if (why) no.push(why);
      else ok.push(f);
    }
    setRefused(no);
    if (ok.length) onAdd(ok);
  }

  async function dropped(e: DropEvent) {
    const files = await Promise.all(e.items.filter(isFileDropItem).map((it) => it.getFile()));
    take(files);
  }

  const n = photos.length;
  return (
    <div className="ui-photodrop" role="group" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`} className="ui-photodrop-label">
        {label}
        {n ? <span className="ui-photodrop-count">{` ${n.toLocaleString("en-US")}`}</span> : null}
      </span>
      <DropZone className="ui-photodrop-zone" aria-label={`Drop photos for ${label}`} onDrop={(e) => void dropped(e)}>
        <FileTrigger acceptedFileTypes={PHOTO_ACCEPT} allowsMultiple onSelect={(list) => list && take(Array.from(list))}>
          <Button variant="secondary" icon={<ImagePlus size={18} aria-hidden />}>
            Add photos
          </Button>
        </FileTrigger>
        <span className="ui-photodrop-drop" aria-hidden>
          or drop them here
        </span>
      </DropZone>
      {refused.length ? (
        <div role="alert">
          <ul className="ui-photodrop-refused">
            {refused.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {n ? (
        <ul className="ui-photodrop-list" aria-label={`${label}, ${n} photos`}>
          {photos.map((p) => (
            <li key={p.id} className="ui-photodrop-row">
              <img src={p.url} alt="" width={40} height={40} className="ui-photodrop-thumb" />
              <span className="ui-photodrop-name">
                <span>{p.name}</span>
                {p.failed ? (
                  <span className="ui-photodrop-failed">{p.failed}</span>
                ) : p.progress != null ? (
                  <progress max={1} value={p.progress} aria-label={`Sending ${p.name}`} />
                ) : null}
              </span>
              <Button variant="ghost" size="sm" icon={<X size={18} aria-hidden />} aria-label={`Remove ${p.name}`} onClick={() => onRemove(p.id)} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Shrinks a photo on the device to the long side (2048 px, JPEG 0.85) so a phone on one bar still sends it. A file the
 * browser cannot decode (HEIC outside Safari) is returned as is. */
export async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const { w, h } = shrinkSize(bmp.width, bmp.height);
    if (w === bmp.width && h === bmp.height && file.type === "image/jpeg") return file;
    const canvas = new OffscreenCanvas(w, h);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
    return await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
  } catch {
    return file;
  }
}
