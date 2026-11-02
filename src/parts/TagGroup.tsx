"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { X } from "lucide-react";
import type { ReactNode } from "react";
import {
  Button,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList,
  composeRenderProps,
  type Key,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps,
} from "react-aria-components";
import { cx, focusRing } from "./cx";
import { Label } from "./Field";

export interface TagGroupProps<T extends object> extends Omit<AriaTagGroupProps, "children"> {
  label: string;
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
  /** What the group says with no tags. */
  emptyText?: string;
}

/** Short values shown as chips: picked filters, a job's trades. With onRemove each chip gets its own 48px remove target. */
export function TagGroup<T extends object>({ label, items, children, emptyText = "None", ...props }: TagGroupProps<T>) {
  return (
    <AriaTagGroup {...props} className={cx("flex flex-col gap-1", props.className)}>
      <Label>{label}</Label>
      <TagList items={items} renderEmptyState={() => <span className="text-cc-body text-cc-muted">{emptyText}</span>} className="flex flex-wrap gap-2">
        {children}
      </TagList>
    </AriaTagGroup>
  );
}

export function TagItem({ children, ...props }: TagProps & { id: Key; children: ReactNode }) {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={cx(
        focusRing,
        "flex min-h-8 cursor-default items-center gap-1 rounded-cc-sm border border-solid border-cc-line bg-cc-panel-2 ps-3 text-cc-meta font-semibold text-cc-text data-allows-removing:pe-0 not-data-allows-removing:pe-3 data-selected:border-cc-accent data-selected:bg-cc-selected data-selected:text-cc-accent data-disabled:text-cc-faint",
      )}
    >
      {composeRenderProps(children, (c, { allowsRemoving }) => (
        <>
          {c}
          {allowsRemoving && (
            <Button
              slot="remove"
              className="relative flex size-8 cursor-default items-center justify-center rounded-cc-sm border-0 bg-transparent text-cc-muted after:absolute after:-inset-2 after:content-[''] data-hovered:text-cc-text data-pressed:bg-cc-selected"
            >
              <X aria-hidden size={14} />
            </Button>
          )}
        </>
      ))}
    </AriaTag>
  );
}
