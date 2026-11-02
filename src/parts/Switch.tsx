"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import type { ReactNode } from "react";
import { Switch as AriaSwitch, type SwitchProps } from "react-aria-components";
import { withClass } from "./cx";

/** On or off, said in words beside it. The label comes first so the switches in a list line up on the right. */
export function Switch({ children, ...props }: SwitchProps & { children: ReactNode }) {
  return (
    <AriaSwitch
      {...props}
      className={withClass(
        props.className,
        "group flex min-h-(--cc-ctl-h) cursor-default items-center justify-between gap-4 text-cc-body text-cc-text data-disabled:text-cc-faint",
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-solid border-cc-border bg-cc-panel-2 px-0.5 transition-colors group-data-selected:border-cc-accent group-data-selected:bg-cc-accent group-data-pressed:border-cc-accent-press group-data-disabled:border-cc-line group-data-focus-visible:outline-3 group-data-focus-visible:outline-solid group-data-focus-visible:outline-offset-3 group-data-focus-visible:outline-cc-accent"
      >
        <span className="size-5 rounded-full bg-cc-border transition-transform group-data-selected:translate-x-5 group-data-selected:bg-cc-bg" />
      </span>
    </AriaSwitch>
  );
}
