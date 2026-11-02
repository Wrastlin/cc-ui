"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { Tooltip as AriaTooltip, TooltipTrigger, type TooltipProps } from "react-aria-components";
import { withClass } from "./cx";

export { TooltipTrigger };

/**
 * The name of an icon-only control, on hover and keyboard focus. A phone never shows it, so it never holds anything a
 * person needs: the control still carries its aria-label.
 */
export function Tooltip({ offset = 8, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      data-cc-part
      offset={offset}
      {...props}
      className={withClass(
        props.className,
        "max-w-64 rounded-cc-sm bg-cc-text px-2 py-1 text-cc-meta font-medium text-cc-bg shadow-cc-menu data-entering:animate-cc-fade-in data-exiting:animate-cc-fade-out",
      )}
    />
  );
}
