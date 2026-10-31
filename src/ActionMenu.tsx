"use client";

import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Header,
  Menu as AriaMenu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  RouterProvider,
  Separator,
} from "react-aria-components";
import Button, { type ButtonSize, type ButtonVariant } from "./Button";

// A button that opens a list of actions, on React Aria's MenuTrigger (HUMAN-UI move 2). Enter, Space or ArrowDown opens
// it, arrows and typeahead move, Escape or a tap outside closes it, and focus goes back to the button.
// Items come in as data, never as children: a collection built in a server component streams into React Aria's hidden
// <template> and is lost (n64r). A server page passes plain objects and elements, which serialize.
// Links go through Next's router, so a pick is a client navigation like the <Link> it replaces.

export type MenuEntry =
  | MenuItemEntry
  | { id: string; separator: true }
  /** Items under a group label, as Views and Operations in a long tab list. The label is not an item. */
  | { id: string; section: string; items: readonly MenuItemEntry[] };

type MenuItemEntry = {
  id: string;
  label: ReactNode;
  /** What typeahead matches and a screen reader reads, when the label is not plain text. */
  textValue?: string;
  href?: string;
  onAction?: () => void;
  /** The view or list on screen now. */
  current?: boolean;
  /** A count, a chevron. Never shrinks. */
  trailing?: ReactNode;
  disabled?: boolean;
  /** Danger colour. For sign out, and nothing else so far. */
  danger?: boolean;
};

/** Ticks items on and off, a filter: every entry with no href and no onAction is a check. A tap or Space toggles and
 * keeps the list open; Enter toggles and closes it (React Aria's checkbox menu). */
export type MenuChecks = {
  selected: ReadonlySet<string>;
  onChange: (selected: Set<string>) => void;
};

function Item({ it, checkable }: { it: MenuItemEntry; checkable?: boolean }) {
  return (
    <MenuItem
      id={it.id}
      href={it.href}
      onAction={it.onAction}
      isDisabled={it.disabled}
      textValue={it.textValue ?? (typeof it.label === "string" ? it.label : undefined)}
      className={["ui-menu-item", it.current ? "ui-menu-on" : "", it.danger ? "ui-menu-danger" : ""].filter(Boolean).join(" ")}
    >
      {({ isSelected }) => (
        <>
          {checkable ? (
            <span className="ui-menu-check" aria-hidden="true">
              {isSelected ? (
                <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : null}
            </span>
          ) : null}
          <span className="ui-menu-label">{it.label}</span>
          {it.trailing ? <span className="ui-menu-trail">{it.trailing}</span> : null}
        </>
      )}
    </MenuItem>
  );
}

export default function Menu({
  label,
  items,
  icon,
  trailing,
  variant = "ghost",
  size = "sm",
  align = "end",
  className,
  menuClassName,
  disabled,
  checks,
  trigger,
  header,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: {
  label?: ReactNode;
  items: readonly MenuEntry[];
  icon?: ReactNode;
  trailing?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Which edge of the button the list lines up with. */
  align?: "start" | "end";
  className?: string;
  menuClassName?: string;
  /** The button cannot open the list, as while a pick is saving. */
  disabled?: boolean;
  checks?: MenuChecks;
  /** A React Aria Button drawn in place of the cc-ui Button, as the shell's avatar. label, icon, variant and size are
   * then unused. */
  trigger?: ReactElement;
  /** A line above the items that is not one, as who is signed in. */
  header?: ReactNode;
  "aria-label"?: string;
  "aria-describedby"?: string;
}) {
  const router = useRouter();
  const isCheck = (it: MenuEntry): it is MenuItemEntry =>
    !!checks && !("separator" in it) && !("section" in it) && !it.href && !it.onAction;
  const checkItems = checks ? items.filter(isCheck) : [];
  const rest = checks ? items.filter((it) => !isCheck(it) && !("separator" in it)) : items;
  const list = (entries: readonly MenuEntry[]) =>
    entries.map((it) =>
      "separator" in it ? (
        <Separator key={it.id} className="ui-menu-sep" />
      ) : "section" in it ? (
        <MenuSection key={it.id} className="ui-menu-sec ui-menu-group">
          <Header className="ui-menu-group-label">{it.section}</Header>
          {it.items.map((x) => <Item key={x.id} it={x} />)}
        </MenuSection>
      ) : (
        <Item key={it.id} it={it} />
      ),
    );
  return (
    <RouterProvider navigate={(href) => router.push(href)}>
      <MenuTrigger>
        {trigger ?? (
          <Button variant={variant} size={size} icon={icon} trailing={trailing} className={className} disabled={disabled} aria-label={ariaLabel} aria-describedby={describedBy}>
            {label}
          </Button>
        )}
        <Popover className="ui-menu-pop" placement={`bottom ${align}`} offset={4}>
          {header ? <div className="ui-menu-head">{header}</div> : null}
          <AriaMenu className={["ui-menu", menuClassName].filter(Boolean).join(" ")} aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}>
            {checks ? (
              <>
                <MenuSection
                  className="ui-menu-sec"
                  selectionMode="multiple"
                  selectedKeys={checks.selected}
                  onSelectionChange={(keys) =>
                    checks.onChange(new Set(keys === "all" ? checkItems.map((it) => it.id) : [...keys].map(String)))
                  }
                >
                  {checkItems.map((it) => <Item key={it.id} it={it} checkable />)}
                </MenuSection>
                {rest.length ? (
                  <>
                    <Separator className="ui-menu-sep" />
                    <MenuSection className="ui-menu-sec">{list(rest)}</MenuSection>
                  </>
                ) : null}
              </>
            ) : (
              list(items)
            )}
          </AriaMenu>
        </Popover>
      </MenuTrigger>
    </RouterProvider>
  );
}
