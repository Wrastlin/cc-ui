"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

/*
 * The way back from a record to its list. One control for every app, in the bar or at the top of a page.
 *
 * It is a button, not a text link (Aaron 11/3: the way back was "awkward small text that says Customers"): bordered,
 * on the tap floor, chevron first, and it names where it lands. Bricks made the same fix first (#58); this is that
 * fix, shared, so fixing it here fixes it everywhere.
 */
export function BackButton({
  label,
  href,
  onClick,
  className,
}: {
  /** Where back lands, named ("Customers", "26268 Wallace"), never "Back". */
  label: string;
  href?: string;
  /** With href, runs before the link navigates and may prevent it (a list kept in state). */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
}) {
  const cls = ["cc-back", className].filter(Boolean).join(" ");
  const inner = (
    <>
      <Chevron />
      <span>{label}</span>
    </>
  );
  return href ? (
    <Link className={cls} href={href} onClick={onClick} title={`Back to ${label}`}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={cls} onClick={onClick} title={`Back to ${label}`}>
      {inner}
    </button>
  );
}

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
