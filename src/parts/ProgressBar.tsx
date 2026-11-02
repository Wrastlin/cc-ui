"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { ProgressBar as AriaProgressBar, type ProgressBarProps } from "react-aria-components";
import { withClass } from "./cx";
import { Label } from "./Field";

/** How far along, in words and a bar. Without a value it is a quiet moving bar for "working on it". */
export function ProgressBar({ label, ...props }: ProgressBarProps & { label: string }) {
  return (
    <AriaProgressBar {...props} className={withClass(props.className, "flex flex-col gap-1")}>
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div className="flex justify-between gap-2">
            <Label>{label}</Label>
            {!isIndeterminate && <span className="text-cc-meta font-medium text-cc-text tabular-nums">{valueText}</span>}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cc-panel-2">
            <div
              className={isIndeterminate ? "h-full w-1/3 animate-pulse rounded-full bg-cc-accent" : "h-full rounded-full bg-cc-accent"}
              style={isIndeterminate ? undefined : { width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
