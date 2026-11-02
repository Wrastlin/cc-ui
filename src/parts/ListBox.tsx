"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import {
  Collection,
  Header,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection,
  composeRenderProps,
  type ListBoxItemProps,
  type ListBoxProps,
} from "react-aria-components";
import { cx, focusRingInset, withClass } from "./cx";

export function ListBox<T extends object>(props: ListBoxProps<T>) {
  return <AriaListBox {...props} className={withClass(props.className, "p-2 outline-none")} />;
}

/** One choice in a list: 48px on a phone, navy text on the 8% tint plus a check when picked, no nested outline. */
export const listItem = cx(
  focusRingInset,
  "group flex min-h-(--cc-ctl-h) cursor-default select-none items-center gap-3 rounded-cc px-3 py-2 text-cc-body text-cc-text data-hovered:bg-cc-hover data-focused:bg-cc-hover data-pressed:bg-cc-selected data-selected:bg-cc-selected data-selected:text-cc-accent data-selected:font-semibold data-disabled:text-cc-faint",
);

export function ListItem(props: ListBoxItemProps & { children: ReactNode }) {
  const textValue = props.textValue ?? (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={withClass(props.className, listItem)}>
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex flex-1 items-center gap-2">{children}</span>
          <span className="flex w-5 shrink-0 justify-center">{isSelected && <Check aria-hidden size={18} />}</span>
        </>
      ))}
    </AriaListBoxItem>
  );
}

/** A visual group inside a list, with a 13px label; never a new destination. */
export function ListSection<T extends object>({
  title,
  items,
  children,
}: {
  title: string;
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
}) {
  return (
    <ListBoxSection className="not-first:mt-2 not-first:border-t not-first:border-solid not-first:border-cc-line not-first:pt-2">
      <Header className="px-3 py-1 text-cc-meta font-semibold text-cc-muted">{title}</Header>
      <Collection items={items}>{children}</Collection>
    </ListBoxSection>
  );
}
