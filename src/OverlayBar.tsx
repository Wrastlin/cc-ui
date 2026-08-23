"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CCLogo } from "./CCLogo";

/*
 * The shell for a screen that runs to the edges.
 *
 * Canvass is a map under the notch, and a permanent 52px band across the top
 * would eat the most useful part of a phone screen. So the same controls float
 * over the content on translucent pills instead of sitting in a band.
 *
 * This is a VARIANT, not a second bar. It obeys the same two rules: back moves
 * you inside the app and names where it lands, the logo leaves the app, and
 * back keeps the leftmost position. The difference is only that there is no
 * band behind it.
 *
 * It matters most here. An installed PWA has no browser chrome and no
 * edge-swipe gesture, so on a full-bleed map these pills are the only
 * navigation that exists at all.
 */

export function OverlayBar({
  back,
  hubHref = "/apps",
  account,
  right,
  className,
}: {
  /** Omit at the top of the app. Names its destination when present. */
  back?: { label: string; href: string };
  hubHref?: string;
  /** Pass `<AccountButton />`. Sits far right, clear of the map controls. */
  account?: ReactNode;
  /** Screen controls that belong up here, e.g. a search. */
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={["cc-overlay", className].filter(Boolean).join(" ")}>
      <div className="cc-overlay-left">
        {back ? (
          <Link className="cc-float cc-float-back" href={back.href} title={`Back to ${back.label}`}>
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
            <span>{back.label}</span>
          </Link>
        ) : null}
        <a className="cc-float cc-float-logo" href={hubHref} title="C&C Services dashboard">
          <CCLogo variant="mark" height={15} title="C&C Services dashboard" />
        </a>
      </div>
      {right || account ? (
        <div className="cc-overlay-right">
          {right}
          {account}
        </div>
      ) : null}
    </div>
  );
}
