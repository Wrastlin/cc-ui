"use client";

import type { ReactNode } from "react";

// A line counted against paper: its number on the paper, what it is, the numbers beside it, then the controls the
// hand would use (a count box, a one-tap mark, a camera). Receiving a PO is the first use (specs/receiving R6, R7,
// R17, R18). Not a Row: a Row is one target, and this line holds a field and buttons that must not nest in a link.
// At a desk the controls sit at the end of the line; under 600 px they wrap to their own line under the text.

export default function CountRow({
  n,
  title,
  sub,
  controls,
  done = false,
  className,
}: {
  /** The line's number on the paper. */
  n?: ReactNode;
  title: ReactNode;
  /** The numbers beside the line: ordered, received, remaining. */
  sub?: ReactNode;
  /** The count box and the line's buttons. */
  controls?: ReactNode;
  /** Fully counted: the line stays in its place, quieter. */
  done?: boolean;
  className?: string;
}) {
  return (
    <div className={["ui-countrow", done ? "ui-countrow-done" : "", className ?? ""].filter(Boolean).join(" ")}>
      {n != null ? <span className="ui-countrow-n">{n}</span> : null}
      <span className="ui-row-main">
        <span className="ui-row-title">{title}</span>
        {sub ? <span className="ui-row-sub">{sub}</span> : null}
      </span>
      {controls ? <span className="ui-countrow-ctl">{controls}</span> : null}
    </div>
  );
}
