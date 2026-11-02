"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx";

/**
 * The one bordered surface between a page and its content (STANDARD A4). One per area at most, never one per row and
 * never a Panel inside a Panel: a list inside it uses lines.
 */
export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cx("rounded-cc-lg border border-solid border-cc-line bg-cc-bg", className)}
    >
      {title && (
        <div className="flex min-h-12 items-center gap-2 border-b border-solid border-cc-line px-4">
          <h2 id={id} className="m-0 text-cc-title font-semibold text-cc-text">
            {title}
          </h2>
          {action && <div className="ms-auto">{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
