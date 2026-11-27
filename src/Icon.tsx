import type { LucideIcon } from "lucide-react";

// One icon set, one stroke, three sizes (gap 15c). Lucide: "Strokes must be 2 pixels wide ... Don't ... mix stroke
// widths"; Carbon: "Don't alter the icon-text size ratio"; Primer: an icon alone in a control takes its name from a
// label. cc-app counted 20 icon sizes and ten strokes on 11/27; this part takes a role, never a number.
// Decided by Claude: the stroke is 1.75 for every icon, because it is already the most used in cc-app and Crisp's
// lighter look, and one value is the rule; the color is always the text's.

export type IconSize = "text" | "control" | "display";

export default function Icon({
  icon: Glyph,
  size = "control",
  label,
  className,
}: {
  icon: LucideIcon;
  /** text: beside a line of text, at its size. control: inside a button or field (18 desk, 20 phone). display: 24. */
  size?: IconSize;
  /** Only when the icon is the whole content of a control or stands alone; otherwise it is hidden from readers. */
  label?: string;
  className?: string;
}) {
  return (
    <Glyph
      className={["ui-icon", `ui-icon-${size}`, className].filter(Boolean).join(" ")}
      strokeWidth={1.75}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    />
  );
}
