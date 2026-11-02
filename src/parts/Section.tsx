"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx";

/**
 * A titled group on a page: the title, its count, at most one action, then rows split by lines. No box around it
 * (A4: the page is the surface); for the one bordered surface a screen may have, use Panel.
 */
export function Section({
  title,
  count,
  action,
  children,
  className,
}: {
  title: string;
  /** Shown as a quiet chip after the title; zero is shown, not hidden. */
  count?: number;
  /** One Button, text or secondary. A section never carries the screen's primary. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={cx("flex flex-col", className)}>
      <div className="flex min-h-12 items-center gap-2 border-b border-solid border-cc-line px-4">
        <h2 id={id} className="m-0 text-cc-title font-semibold text-cc-text">
          {title}
        </h2>
        {count != null && (
          <span className="inline-flex min-h-6 items-center rounded-cc-sm bg-cc-panel-2 px-2 text-cc-meta font-semibold text-cc-muted tabular-nums">
            {count}
          </span>
        )}
        {action && <div className="ms-auto">{action}</div>}
      </div>
      <div className="flex flex-col [&>*]:border-b [&>*]:border-solid [&>*]:border-cc-line">{children}</div>
    </section>
  );
}

/** One line in a Section: a 56px row on the 16px rail with its name and, at the end, its value or control. */
export function SectionRow({
  label,
  detail,
  end,
  className,
}: {
  label: ReactNode;
  /** The deciding fact under the name, 13px. */
  detail?: ReactNode;
  end?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex min-h-14 items-center gap-3 px-4 py-2", className)}>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-cc-body font-semibold text-cc-text">{label}</span>
        {detail && <span className="text-cc-meta text-cc-muted">{detail}</span>}
      </div>
      {end && <div className="shrink-0 text-cc-body text-cc-text tabular-nums">{end}</div>}
    </div>
  );
}
