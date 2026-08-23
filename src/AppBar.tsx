"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CCLogo } from "./CCLogo";

/*
 * The C&C app bar. One implementation, every product.
 *
 * Control order is fixed and is the whole point:
 *
 *   back · logo · product · (spacer) · action · account
 *
 * Two rules decide everything else here, and they are the ones that were
 * ambiguous in every hand-rolled bar this replaces:
 *
 *   BACK MOVES YOU INSIDE AN APP. THE LOGO LEAVES IT.
 *
 * Back goes up exactly one screen and names where it lands, so an agreement
 * returns to the job and the job returns to the list. It never crosses into
 * another product; that trip is the logo's, and it is the only control that
 * makes it. At the top of an app there is nothing above the list, so `back` is
 * simply omitted and the logo takes the left edge. No reserved empty gap: an
 * indent with nothing in it reads as a bug.
 *
 * Back is pinned to the left edge and the logo shifts, never the other way
 * round, because back is the control that gets clicked twenty times an hour.
 * The label is capped (--cc-back-max) so that shift stays small and bounded.
 *
 * An installed PWA has no browser chrome and no edge-swipe gesture, so on
 * Canvass and Notetaker this control is the only way back that exists. It is
 * not decoration.
 *
 * The bar takes the primary action as DATA rather than as a rendered node,
 * because the bar is the only thing that knows its own width budget. On a
 * phone, controls sit on the 44px touch floor and a label like "Send for
 * signature" cannot coexist with the logo, the product name and the avatar;
 * something has to give, and the shell decides what, once, instead of nine
 * apps each guessing. That is why `icon` is required: below 560px the label
 * goes and the icon is all that is left.
 */

export type BackTarget = {
  /**
   * Where back lands, named. "Pending", "26268 Wallace". Never "Back": the
   * point is that you can read the destination before you commit to it.
   */
  label: string;
  /** Where it goes, when going back is navigation. */
  href?: string;
  /**
   * What it does, when it is not. CRMP's admin console is one route whose
   * sections are state, so "up one screen" there is a setState, not a URL. The
   * control has to be the same control either way, or the rule stops being a
   * rule.
   */
  onClick?: () => void;
};

export type BarAction = {
  /** Always the accessible name. Shown as a label only when there is room. */
  label: string;
  /** Required: on a phone this is the whole control. */
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
};

export function AppBar({
  back,
  product,
  hubHref = "/apps",
  action,
  extraActions,
  account,
  className,
}: {
  /** Omit at the top of an app. There is nothing above the list. */
  back?: BackTarget;
  /** The product's name and its home. Reaching product home never depends on
   *  the logo or on back. */
  product: { name: string; href: string };
  /** Where the logo goes. The dashboard, from every screen in every app. */
  hubHref?: string;
  /** The one action this screen is for. The shell sizes it to fit. */
  action?: BarAction;
  /**
   * Anything else. The shell makes no promise that these fit on a phone, so
   * put secondary controls in the page or the account menu instead.
   */
  extraActions?: ReactNode;
  /**
   * The account control. Pass `<AccountButton />` from this package: the shell
   * owns the avatar so it is identical everywhere, but the menu's contents are
   * the app's, because Notetaker has a daily brief and Subcontracts does not.
   * Omit only when signed out.
   */
  account?: ReactNode;
  className?: string;
}) {
  return (
    <header className={["cc-bar", className].filter(Boolean).join(" ")}>
      {back ? (
        <>
          {back.href ? (
            <Link className="cc-back" href={back.href} title={`Back to ${back.label}`}>
              <Chevron />
              <span>{back.label}</span>
            </Link>
          ) : (
            <button
              type="button"
              className="cc-back"
              onClick={back.onClick}
              title={`Back to ${back.label}`}
            >
              <Chevron />
              <span>{back.label}</span>
            </button>
          )}
          <span className="cc-bar-rule" aria-hidden />
        </>
      ) : null}

      <a className="cc-bar-logo" href={hubHref} title="C&C Services dashboard">
        <CCLogo variant="mark" title="C&C Services dashboard" />
      </a>

      <Link className="cc-bar-product" href={product.href}>
        {product.name}
      </Link>

      <span className="cc-bar-spacer" />

      {extraActions}
      {action ? <BarActionControl {...action} /> : null}

      {account}
    </header>
  );
}

function BarActionControl({
  label,
  icon,
  href,
  onClick,
  variant = "primary",
  disabled,
}: BarAction) {
  const inner = (
    <>
      <span className="cc-bar-action-glyph" aria-hidden>
        {icon}
      </span>
      <span className="cc-bar-action-label">{label}</span>
    </>
  );
  const cls = `cc-bar-action cc-bar-action-${variant}`;
  if (href) {
    return (
      <Link className={cls} href={href} title={label} aria-label={label}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {inner}
    </button>
  );
}

/**
 * The signed-out bar. A sub signing an agreement or a homeowner uploading
 * paperwork has no account, nowhere to go back to and no idea what a dashboard
 * is, so the bar stops being navigation and becomes identification. This is
 * the one place the full lockup belongs.
 */
export function IdentityBar({ className }: { className?: string }) {
  return (
    <header className={["cc-bar cc-bar-identity", className].filter(Boolean).join(" ")}>
      <CCLogo variant="lockup" height={34} title="C&C Services Group" />
    </header>
  );
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
