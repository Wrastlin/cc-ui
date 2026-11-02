"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { Popover as AriaPopover, type PopoverProps } from "react-aria-components";
import { withClass } from "./cx";

/** The one floating surface: white, 12px radius, the menu shadow (VISUAL-SYSTEM depth). */
export function Popover({ offset = 4, ...props }: PopoverProps) {
  return (
    <AriaPopover
      data-cc-part
      offset={offset}
      {...props}
      className={withClass(
        props.className,
        "min-w-(--trigger-width) overflow-auto rounded-cc-lg border border-solid border-cc-line bg-cc-bg text-cc-text shadow-cc-menu outline-none data-entering:animate-cc-in data-exiting:animate-cc-out",
      )}
    />
  );
}
