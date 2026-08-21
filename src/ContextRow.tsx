"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Row two: never empty, never guessing.
 *
 * A list screen puts tabs here. A detail screen puts the record's name and its
 * status here. Both are the same height, so nothing jumps as you navigate
 * between them, which is the reason the shell owns this row instead of letting
 * each screen decide whether to draw one.
 *
 * It is also deliberately generic. The parked job-bar idea (a job carried
 * across every app, with live counts) drops into this slot later without any
 * app changing to receive it.
 */

export type Tab = {
  label: string;
  href: string;
  /** Shown after the label. Omit rather than passing 0 if a zero is noise. */
  count?: number;
  current?: boolean;
};

export function TabRow({ tabs, label = "Sections" }: { tabs: Tab[]; label?: string }) {
  return (
    <nav className="cc-tabs" aria-label={label}>
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={t.current ? "cc-tab cc-tab-on" : "cc-tab"}
          aria-current={t.current ? "page" : undefined}
        >
          {t.label}
          {typeof t.count === "number" ? (
            <span className="cc-tab-n">{t.count}</span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}

/**
 * The detail-screen row. The record's identity lives here rather than in the
 * bar because here it has width: a job name can be long, and in the bar it
 * would have to truncate against the product name.
 */
export function RecordRow({
  title,
  sub,
  status,
}: {
  title: ReactNode;
  /** Address, trade, whoever owns it. One line, truncates. */
  sub?: ReactNode;
  /** A status chip, or any trailing marker. Never shrinks. */
  status?: ReactNode;
}) {
  return (
    <div className="cc-record">
      <span className="cc-record-title">{title}</span>
      {sub ? <span className="cc-record-sub">{sub}</span> : null}
      <span className="cc-bar-spacer" />
      {status ? <span className="cc-record-trail">{status}</span> : null}
    </div>
  );
}

export type ChipTone = "neutral" | "accent" | "good" | "warn" | "danger";

/** The one status chip. Tone is meaning, not decoration. */
export function Chip({ tone = "neutral", children }: { tone?: ChipTone; children: ReactNode }) {
  return <span className={`cc-chip cc-chip-${tone}`}>{children}</span>;
}
