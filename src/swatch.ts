/** Relative luminance per WCAG 2.x; null for anything that is not #rgb or #rrggbb. */
function luminance(hex: string): number | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Whether a color sits under 3:1 against the white canvas (STANDARD A17), so its chip needs a drawn edge or it reads
 * as an empty circle (White, Almond, Linen). Dark chips stay borderless: a gray ring on dark brown is noise.
 */
export function needsEdge(hex: string | null | undefined): boolean {
  const l = hex ? luminance(hex) : null;
  return l !== null && 1.05 / (l + 0.05) < 3;
}
