"use client";
// Adapted from Untitled UI React (untitleduico/react), MIT: LICENSES/.

import type { ReactNode } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  type Key,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from "react-aria-components";
import { cx, focusRing } from "./cx";

/**
 * Related buttons joined on one edge (a filter, a zoom, a view size). With selectionMode the picked ones read as picked;
 * without it each is a plain action. Never the screen's primary: that stays one Button on its own.
 */
export function ButtonGroup({
  className,
  ...props
}: ToggleButtonGroupProps & { "aria-label": string; className?: string }) {
  return (
    <ToggleButtonGroup
      {...props}
      className={cx(
        "inline-flex w-fit overflow-hidden rounded-cc border border-solid border-cc-border bg-cc-bg [&>*+*]:border-s [&>*+*]:border-solid [&>*+*]:border-cc-border",
        className,
      )}
    />
  );
}

export function ButtonGroupItem({ children, ...props }: ToggleButtonProps & { id: Key; children: ReactNode }) {
  return (
    <ToggleButton
      {...props}
      className={cx(
        focusRing,
        "flex min-h-(--cc-ctl-h) cursor-default items-center gap-2 border-0 bg-cc-bg px-4 text-cc-body font-semibold text-cc-text data-focus-visible:-outline-offset-3 data-hovered:bg-cc-hover data-pressed:bg-cc-selected data-selected:bg-cc-selected data-selected:text-cc-accent data-disabled:text-cc-faint",
      )}
    >
      {children}
    </ToggleButton>
  );
}
