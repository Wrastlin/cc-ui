"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import type { ReactNode } from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";
import { cx, focusRing, withClass } from "./cx";

export function Tabs(props: TabsProps) {
  return <AriaTabs {...props} className={withClass(props.className, "flex flex-col")} />;
}

/** Baseline tabs: 48px tall, 24px apart, a 2px navy rule under the current one (VISUAL-SYSTEM tabs). */
export function TabList<T extends object>(props: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={withClass(props.className, "flex gap-6 overflow-x-auto border-b border-solid border-cc-line")}
    />
  );
}

export function TabItem(props: TabProps) {
  return (
    <AriaTab
      {...props}
      className={withClass(
        props.className,
        cx(
          focusRing,
          "-mb-px flex min-h-12 cursor-default items-center whitespace-nowrap border-b-2 border-solid border-transparent text-cc-body font-medium text-cc-muted data-hovered:text-cc-text data-selected:border-cc-accent data-selected:font-semibold data-selected:text-cc-accent data-disabled:text-cc-faint",
        ),
      )}
    />
  );
}

export function TabPanel(props: TabPanelProps) {
  return <AriaTabPanel {...props} className={withClass(props.className, cx(focusRing, "pt-4"))} />;
}

export interface SegmentedOption {
  id: Key;
  label: ReactNode;
}

/**
 * Two to four views of the same list (Rotation / History, Incomplete / Completed): a pale track, the current one white
 * with navy words. One is always picked.
 */
export function Segmented({
  label,
  options,
  value,
  onChange,
  className,
}: {
  /** Read by a screen reader; the options say the rest. */
  label: string;
  options: SegmentedOption[];
  value: Key;
  onChange: (id: Key) => void;
  className?: string;
}) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (next !== undefined) onChange(next);
      }}
      className={cx("flex gap-1 rounded-cc-lg bg-cc-panel-2 p-1", className)}
    >
      {options.map((o) => (
        <ToggleButton
          key={o.id}
          id={o.id}
          className={cx(
            focusRing,
            "flex min-h-12 flex-1 cursor-default items-center justify-center gap-2 rounded-cc border-0 bg-transparent px-3 text-cc-body font-medium text-cc-muted data-hovered:text-cc-text data-selected:bg-cc-bg data-selected:font-semibold data-selected:text-cc-accent data-selected:shadow-cc-edge",
          )}
        >
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
