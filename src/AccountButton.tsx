"use client";

import { useRef } from "react";
import { Button as AriaButton } from "react-aria-components";
import Menu, { type MenuEntry } from "./ActionMenu";

/*
 * The account control: who is signed in, and the way out.
 *
 * The avatar belongs to the shell, so it is the same 30px navy circle in every
 * app. The MENU does not: Notetaker has a daily brief, CRMP has a team panel,
 * Subcontracts has neither. So the shell owns the control and the app supplies
 * the items, rather than the shell pretending it knows what every product's
 * menu contains.
 *
 * "All apps" and "Sign out" are appended by the shell, not by each app,
 * because those two are the ones that were missing from bars people actually
 * shipped. An app with no way to sign out is unfinished.
 */

export type AccountItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Renders in danger colour. For sign out, and nothing else so far. */
  danger?: boolean;
};

/** name@ccservicesgroup.com -> NA. first.last@ -> FL. */
export function initialsFromEmail(email: string): string {
  const local = (email.split("@")[0] || "").trim();
  if (!local) return "?";
  const parts = local.split(/[.\-_+]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

export function AccountButton({
  email,
  items = [],
  hubHref = "/apps",
  onSignOut,
}: {
  /**
   * Optional because some apps only learn who is signed in after hydration,
   * and an avatar that pops in late is worse than one that fills in late.
   */
  email?: string;
  /** Product-specific entries, shown above the shell's own two. */
  items?: AccountItem[];
  hubHref?: string;
  /** Omit only if this app genuinely cannot sign anyone out. */
  onSignOut?: () => void;
}) {
  const avatar = useRef<HTMLButtonElement>(null);

  const all: AccountItem[] = [
    ...items,
    { label: "All apps", href: hubHref },
    ...(onSignOut ? [{ label: "Sign out", onClick: onSignOut, danger: true }] : []),
  ];

  // An action runs after the menu has closed and focus is back on the avatar, so a dialog it opens (Report a bug)
  // captures the avatar to return to, not a menu item that is about to unmount (walk-n65a bug.afterEscape).
  const entries: MenuEntry[] = all.map((it) => ({
    id: it.label,
    label: it.label,
    href: it.href,
    danger: it.danger,
    onAction: it.href
      ? undefined
      : () =>
          setTimeout(() => {
            avatar.current?.focus();
            it.onClick?.();
          }, 0),
  }));

  const name = email ? `${email}, account and menu` : "Account and menu";

  return (
    <div className="cc-account">
      <Menu
        items={entries}
        aria-label={name}
        header={email}
        trigger={
          <AriaButton ref={avatar} className="cc-avatar" aria-label={name}>
            {email ? initialsFromEmail(email) : <PersonGlyph />}
          </AriaButton>
        }
      />
    </div>
  );
}

function PersonGlyph() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0114 0" />
    </svg>
  );
}
