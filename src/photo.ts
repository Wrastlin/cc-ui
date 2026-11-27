// Which files are photos, and the one plain sentence for one that is not (Polaris drop zone: client errors as one
// sentence naming the types). Same formats as the collage intake (tools/collage/album.py PHOTO).

export const PHOTO_EXT = ["jpg", "jpeg", "heic", "heif", "png", "webp", "tif", "tiff", "gif", "bmp", "avif"] as const;

/** For the picker's accept list: image/* plus the extensions, since iOS names HEIC files with an empty type. */
export const PHOTO_ACCEPT = ["image/*", ...PHOTO_EXT.map((e) => `.${e}`)];

export const PHOTO_TYPES_WORDS = "JPG, HEIC, PNG, WebP, TIFF, GIF, BMP or AVIF";

export function isPhoto(name: string, type = ""): boolean {
  if (type.startsWith("image/")) return true;
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return name.includes(".") && (PHOTO_EXT as readonly string[]).includes(ext);
}

/** Why a file was not added, or null when it was. */
export function refusal(name: string, type = "", bytes = 0, maxBytes = 50 * 1024 * 1024): string | null {
  if (!isPhoto(name, type)) return `${name} is not a photo. Photos can be ${PHOTO_TYPES_WORDS}.`;
  if (bytes > maxBytes) return `${name} is over ${Math.round(maxBytes / 1024 / 1024)} MB.`;
  return null;
}

/** The long side a photo is shrunk to on the device before upload (systems.md PhotoDrop: one bar still sends a walk). */
export const SHRINK_LONG_SIDE = 2048;

export function shrinkSize(w: number, h: number, long = SHRINK_LONG_SIDE): { w: number; h: number } {
  const m = Math.max(w, h);
  if (m <= long) return { w, h };
  const k = long / m;
  return { w: Math.round(w * k), h: Math.round(h * k) };
}
