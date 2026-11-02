import { composeRenderProps } from "react-aria-components";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// A caller's className is appended, never merged: the parts carry no tailwind-merge so cc-ui adds no dependency.
// Pass layout (width, margin, grid placement) only; a color or size that fights the part is a new variant here.
export function withClass<T>(className: string | ((v: T) => string) | undefined, base: string) {
  return composeRenderProps(className, (c) => cx(base, c));
}

/** Solid navy, 3px, 3px out (VISUAL-SYSTEM color). Only on keyboard focus: React Aria sets data-focus-visible. */
export const focusRing =
  "outline-none data-focus-visible:outline-3 data-focus-visible:outline-solid data-focus-visible:outline-offset-3 data-focus-visible:outline-cc-accent";
/** The same ring inside a list or a grid, where an outside ring would sit on the neighbor row. */
export const focusRingInset =
  "outline-none data-focus-visible:outline-3 data-focus-visible:outline-solid data-focus-visible:-outline-offset-3 data-focus-visible:outline-cc-accent";

/** A control's edge and fill: white, a border that reads, 8px radius, the shared height. */
export const controlBox =
  "min-h-(--cc-ctl-h) rounded-cc border border-solid border-cc-border bg-cc-bg text-cc-input text-cc-text";
