"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Menu as AriaMenu,
  MenuItem,
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
  | {
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
    }
  | { id: string; separator: true };

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
  "aria-label": ariaLabel,
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
  "aria-label"?: string;
}) {
  const router = useRouter();
  return (
    <RouterProvider navigate={(href) => router.push(href)}>
      <MenuTrigger>
        <Button variant={variant} size={size} icon={icon} trailing={trailing} className={className} aria-label={ariaLabel}>
          {label}
        </Button>
        <Popover className="ui-menu-pop" placement={`bottom ${align}`} offset={4}>
          <AriaMenu className={["ui-menu", menuClassName].filter(Boolean).join(" ")} aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}>
            {items.map((it) =>
              "separator" in it ? (
                <Separator key={it.id} className="ui-menu-sep" />
              ) : (
                <MenuItem
                  key={it.id}
                  id={it.id}
                  href={it.href}
                  onAction={it.onAction}
                  isDisabled={it.disabled}
                  textValue={it.textValue ?? (typeof it.label === "string" ? it.label : undefined)}
                  className={["ui-menu-item", it.current ? "ui-menu-on" : ""].filter(Boolean).join(" ")}
                >
                  <span className="ui-menu-label">{it.label}</span>
                  {it.trailing ? <span className="ui-menu-trail">{it.trailing}</span> : null}
                </MenuItem>
              ),
            )}
          </AriaMenu>
        </Popover>
      </MenuTrigger>
    </RouterProvider>
  );
}
