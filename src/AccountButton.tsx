"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  email: string;
  /** Product-specific entries, shown above the shell's own two. */
  items?: AccountItem[];
  hubHref?: string;
  /** Omit only if this app genuinely cannot sign anyone out. */
  onSignOut?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const all: AccountItem[] = [
    ...items,
    { label: "All apps", href: hubHref },
    ...(onSignOut ? [{ label: "Sign out", onClick: onSignOut, danger: true }] : []),
  ];

  return (
    <div className="cc-account" ref={root}>
      <button
        type="button"
        className="cc-avatar"
        aria-label={`${email}, account and menu`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {initialsFromEmail(email)}
      </button>
      {open ? (
        <div className="cc-account-menu" role="menu">
          <div className="cc-account-who">{email}</div>
          {all.map((it) =>
            it.href ? (
              it.href.startsWith("http") ? (
                <a
                  key={it.label}
                  className="cc-account-item"
                  role="menuitem"
                  href={it.href}
                  onClick={() => setOpen(false)}
                >
                  {it.label}
                </a>
              ) : (
                <Link
                  key={it.label}
                  className="cc-account-item"
                  role="menuitem"
                  href={it.href}
                  onClick={() => setOpen(false)}
                >
                  {it.label}
                </Link>
              )
            ) : (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                className={
                  it.danger ? "cc-account-item cc-account-item-danger" : "cc-account-item"
                }
                onClick={() => {
                  setOpen(false);
                  it.onClick?.();
                }}
              >
                {it.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
