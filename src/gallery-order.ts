// Order and cover rules for PhotoGallery, kept apart so they run under node --test.

/** One item moved from `from` to `to`, the rest kept in order. Out of range returns the list unchanged. */
export function move<T>(list: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length || from === to) return [...list];
  const out = [...list];
  const [it] = out.splice(from, 1);
  out.splice(to, 0, it);
  return out;
}

/** The first photo becomes the cover only when there is none (adding never replaces the cover). */
export function withCover<P extends { id: string }>(v: { photos: readonly P[]; cover?: string }) {
  const has = v.cover && v.photos.some((p) => p.id === v.cover);
  return { photos: v.photos, cover: has ? v.cover : v.photos[0]?.id };
}
