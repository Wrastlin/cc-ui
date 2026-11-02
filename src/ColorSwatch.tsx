import type { CSSProperties } from "react";
import { needsEdge } from "./swatch";

type SwatchProps = {
  /** The chip's color. A hex decides the edge by itself (needsEdge); none draws the hatched "not picked" chip. */
  hex: string | null | undefined;
  /** Pixels, or a CSS length for a chip that follows a token (a tap target's height). */
  size?: number | string;
  /** A ring in the color with no fill: a kind switched off in a key. */
  hollow?: boolean;
  /**
   * Only for a CSS variable color (var(--warn)), whose value the chip cannot read; a hex never takes it. Leaves the
   * rule in one place: the caller states what needsEdge would say of the variable's value.
   */
  edge?: boolean;
  /** Spoken when the chip is the only thing naming the color; without it the chip is decorative. */
  label?: string;
  className?: string;
};

/**
 * Every color chip in every C&C app: a material color, a kind of work, a status, a layer. One edge rule (STANDARD A17)
 * so a light chip never reads as an empty circle and a dark one carries no ring.
 */
export default function Swatch({ hex, size = 16, hollow, edge, label, className }: SwatchProps) {
  const lined = !hex || (edge ?? needsEdge(hex));
  const cls = ["ui-swatch", !hex && "ui-swatch-none", lined && "ui-swatch-edge", hollow && "ui-swatch-hollow", className]
    .filter(Boolean)
    .join(" ");
  const style = { "--ui-swatch": typeof size === "number" ? `${size}px` : size, ...(hex ? { "--ui-swatch-color": hex } : {}) } as CSSProperties;
  return label ? <span className={cls} style={style} role="img" aria-label={label} /> : <span className={cls} style={style} aria-hidden />;
}
