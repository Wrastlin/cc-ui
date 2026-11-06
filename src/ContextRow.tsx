"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { sectionTabs } from "./menu";

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

export function TabRow({ tabs, label = "Sections", className }: { tabs: Tab[]; label?: string; className?: string }) {
  // One row that scrolls sideways on a phone (Aaron 11/6, the two-row tab bar: "a huge mess"); the open tab is scrolled
  // into sight so a tab past the edge never hides where you are.
  const row = useRef<HTMLElement>(null);
  const on = tabs.find((t) => t.current)?.href;
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = row.current;
    if (!el || !box || box.scrollWidth <= box.clientWidth) return;
    box.scrollLeft = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
  }, [on]);
  return (
    <nav ref={row} className={className ? `cc-tabs ${className}` : "cc-tabs"} aria-label={label}>
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={t.current ? "cc-tab cc-tab-on" : "cc-tab"}
          aria-current={t.current ? "page" : undefined}
        >
          {t.label}
          {typeof t.count === "number" ? (
            <span className="cc-tab-n">{t.count.toLocaleString("en-US")}</span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Row two on every page inside a section: the section's tabs, from the one map (menu.ts, PATTERNS P15). Each frame
 * mounts this once, so a page never draws its own copy of where things are. Nothing outside a section. A phone hides
 * a row of separate tools (shell.css): the menu already holds them, and the row read as a header of other apps (Aaron 11/6).
 */
export function SectionTabRow({ apps, path, search }: { apps: readonly string[]; path: string; search?: string }) {
  const here = sectionTabs(apps, path, search);
  if (!here) return null;
  return <TabRow label={here.section.title} tabs={here.tabs} className={here.views ? undefined : "cc-section-tabs"} />;
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

export type Crumb = {
  label: string;
  /** Omit on the last crumb: it is the screen you are on. */
  href?: string;
};

/**
 * Where this screen sits, every level tappable. The last crumb is the current
 * screen and is not a link. Each link keeps the 48px touch floor on a phone, so
 * any level is one tap away, not only the one back reaches.
 */
export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className={className ? `cc-crumbs ${className}` : "cc-crumbs"}>
      <ol>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${i}-${c.label}`}>
              {c.href && !last ? (
                <Link href={c.href} className="cc-crumb">
                  {c.label}
                </Link>
              ) : (
                <span className="cc-crumb cc-crumb-here" aria-current="page">
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
